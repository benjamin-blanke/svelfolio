import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

const USERNAME = 'benjamin-blanke';

type GitHubEvent = {
	type?: string;
	repo?: { name?: string };
	created_at?: string;
	payload?: {
		head?: string;
		commits?: Array<{ message?: string; sha?: string }>;
	};
};

export const GET: RequestHandler = async ({ fetch }) => {
	const headers: HeadersInit = {
		Accept: 'application/vnd.github+json',
		'X-GitHub-Api-Version': '2022-11-28',
		'User-Agent': 'svelfolio'
	};

	if (env.GITHUB_TOKEN) {
		headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
	}

	const response = await fetch(
		`https://api.github.com/users/${USERNAME}/events/public?per_page=30`,
		{ headers }
	);

	if (!response.ok) {
		return json({ error: 'Unable to load GitHub activity' }, { status: 502 });
	}

	const events = (await response.json()) as GitHubEvent[];
	const push = events.find(
		(event) =>
			event.type === 'PushEvent' &&
			event.repo?.name &&
			event.created_at
	);

	if (!push?.repo?.name || !push.created_at) {
		return json({}, { headers: { 'cache-control': 'public, max-age=60, s-maxage=300' } });
	}

	const commits = push.payload?.commits ?? [];
	const latestCommit = commits.at(-1);
	const repoUrl = `https://github.com/${push.repo.name}`;
	const commitUrl = latestCommit?.sha
		? `${repoUrl}/commit/${latestCommit.sha}`
		: repoUrl;

	return json(
		{
			repo: push.repo.name,
			message: latestCommit?.message?.split('\n')[0] ?? 'Updated repository',
			url: commitUrl,
			pushedAt: push.created_at,
			commitCount: commits.length || 1,
			sha: latestCommit?.sha?.slice(0, 7)
		},
		{
			headers: {
				'cache-control': 'public, max-age=60, s-maxage=300'
			}
		}
	);
};
