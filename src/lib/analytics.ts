declare global {
	interface Window {
		umami?: {
			track: (event?: string | Record<string, unknown>, data?: Record<string, unknown>) => void;
		};
	}
}

export function track(event: string, data?: Record<string, string | number | boolean | null | undefined>) {
	if (typeof window === 'undefined') return;
	const clean = data
		? Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined && value !== null))
		: undefined;
	window.umami?.track(event, clean);
}
