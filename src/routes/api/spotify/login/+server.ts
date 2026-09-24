import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, cookies }) => {
	if (!env.SPOTIFY_CLIENT_ID) throw new Error('SPOTIFY_CLIENT_ID is not configured.');

	const state = crypto.randomUUID();
	cookies.set('spotify_oauth_state', state, {
		path: '/api/spotify',
		httpOnly: true,
		sameSite: 'lax',
		secure: url.protocol === 'https:',
		maxAge: 600
	});

	const callback = `${url.origin}/api/spotify/callback`;
	const params = new URLSearchParams({
		client_id: env.SPOTIFY_CLIENT_ID,
		response_type: 'code',
		redirect_uri: callback,
		scope: 'user-read-currently-playing',
		state,
		show_dialog: 'true'
	});

	redirect(302, `https://accounts.spotify.com/authorize?${params}`);
};
