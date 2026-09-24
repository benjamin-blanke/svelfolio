import { error, html } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

type TokenResponse = {
	refresh_token?: string;
	error?: string;
	error_description?: string;
};

const escape = (value: string) =>
	value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char] ?? char);

export const GET: RequestHandler = async ({ url, cookies, fetch }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const expectedState = cookies.get('spotify_oauth_state');
	cookies.delete('spotify_oauth_state', { path: '/api/spotify' });

	if (!code || !state || !expectedState || state !== expectedState) error(400, 'Invalid Spotify OAuth state.');
	if (!env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) error(500, 'Spotify OAuth is not configured.');

	const redirectUri = `${url.origin}/api/spotify/callback`;
	const auth = btoa(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`);
	const response = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			Authorization: `Basic ${auth}`,
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code,
			redirect_uri: redirectUri
		})
	});

	const token = (await response.json()) as TokenResponse;
	if (!response.ok || !token.refresh_token) error(502, token.error_description ?? token.error ?? 'Spotify did not return a refresh token.');

	const refreshToken = escape(token.refresh_token);
	return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Spotify connected</title><style>body{margin:0;background:#080808;color:#ddd;font:14px ui-monospace,SFMono-Regular,Menlo,monospace;min-height:100vh;display:grid;place-items:center;padding:20px;box-sizing:border-box}.box{width:min(680px,100%);border:1px solid #333;padding:28px;box-sizing:border-box}h1{font-size:20px;color:#fff;font-weight:500}code{display:block;overflow-wrap:anywhere;background:#111;border:1px solid #2b2b2b;padding:14px;margin:18px 0;color:#fff}.muted{color:#777}.ok{color:#67e8f9}</style></head><body><main class="box"><div class="muted">BLANKE.LOL / SPOTIFY SETUP</div><h1><span class="ok">$</span> spotify connected</h1><p>Add this value to Vercel as <b>SPOTIFY_REFRESH_TOKEN</b> for Production, then redeploy.</p><code>${refreshToken}</code><p class="muted">Treat this token like a password. After saving it, remove or disable these temporary OAuth setup routes.</p></main></body></html>`);
};
