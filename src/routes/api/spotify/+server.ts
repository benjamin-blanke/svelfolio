import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

type SpotifyToken = { access_token?: string };
type SpotifyPlaying = {
	is_playing?: boolean;
	item?: {
		name?: string;
		type?: string;
		artists?: Array<{ name?: string }>;
		external_urls?: { spotify?: string };
	};
};

async function getAccessToken() {
	if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET || !env.SPOTIFY_REFRESH_TOKEN) return null;

	const auth = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: env.SPOTIFY_REFRESH_TOKEN
		})
	});

	if (!response.ok) return null;
	const token = (await response.json()) as SpotifyToken;
	return token.access_token ?? null;
}

export const GET: RequestHandler = async ({ fetch }) => {
	const accessToken = await getAccessToken();
	if (!accessToken) return json({ isPlaying: false }, { status: 200 });

	const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
		headers: { Authorization: `Bearer ${accessToken}` }
	});

	if (response.status === 204) return json({ isPlaying: false });
	if (!response.ok) return json({ isPlaying: false }, { status: 200 });

	const data = (await response.json()) as SpotifyPlaying;
	if (!data.is_playing || !data.item || data.item.type !== 'track') {
		return json({ isPlaying: false });
	}

	const title = data.item.name;
	const artist = data.item.artists?.map((item) => item.name).filter(Boolean).join(', ');
	if (!title || !artist) return json({ isPlaying: false });

	return json(
		{
			isPlaying: true,
			title,
			artist,
			url: data.item.external_urls?.spotify
		},
		{ headers: { 'cache-control': 'public, max-age=5, s-maxage=10' } }
	);
};
