import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

type OpusStatus = 'operational' | 'degraded' | 'outage' | 'maintenance';

function readStatus(svg: string): OpusStatus | null {
	const value = svg.toLowerCase();
	if (value.includes('operational') || value.includes('online')) return 'operational';
	if (value.includes('maintenance')) return 'maintenance';
	if (value.includes('degraded') || value.includes('partly')) return 'degraded';
	if (value.includes('outage') || value.includes('offline')) return 'outage';
	return null;
}

export const GET: RequestHandler = async ({ fetch }) => {
	try {
		const response = await fetch('https://status.opus-host.de/api/v3/badge/status?style=inline&theme=dark', {
			headers: { Accept: 'image/svg+xml,text/plain,*/*' }
		});

		if (!response.ok) {
			return json({ status: null }, { status: 502 });
		}

		const status = readStatus(await response.text());
		return json(
			{ status },
			{ headers: { 'cache-control': 'public, max-age=30, s-maxage=60' } }
		);
	} catch {
		return json({ status: null }, { status: 502 });
	}
};
