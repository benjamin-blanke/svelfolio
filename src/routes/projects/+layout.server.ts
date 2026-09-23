import type { Picture, Project } from '$lib/types';
import type { LayoutServerLoad } from './$types';

const posterModules = import.meta.glob('/src/lib/assets/projects/*.{webp,png,gif}', {
	eager: true,
	query: '?enhanced',
	import: 'default'
}) as Record<string, Picture>;

function resolvePoster(poster: string | Picture): Picture {
	if (typeof poster !== 'string') return poster;
	const mod = posterModules[poster.replace('$lib', '/src/lib')];
	if (!mod) throw new Error(`Missing poster ${poster}`);
	return mod;
}

function githubRepoPath(url: string) {
	try {
		const parsed = new URL(url);
		if (parsed.hostname !== 'github.com') return null;
		const [owner, repo] = parsed.pathname.split('/').filter(Boolean);
		return owner && repo ? `${owner}/${repo.replace(/\.git$/, '')}` : null;
	} catch {
		return null;
	}
}

export const load: LayoutServerLoad = async ({ setHeaders, fetch }) => {
	let allTechstacks: string[] = [];
	const items: Project[] = [];

	const paths = import.meta.glob('/src/contents/projects/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Project, 'slug'> & { techstack?: string[]; poster: string | Picture };
			const post = { ...metadata, poster: resolvePoster(metadata.poster), slug } satisfies Project;

			if (metadata.github) {
				const repo = githubRepoPath(metadata.github);
				if (repo) {
					try {
						const response = await fetch(`https://api.github.com/repos/${repo}`, {
							headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'svelfolio' }
						});
						if (response.ok) {
							const github = await response.json();
							post.githubData = {
								fullName: github.full_name,
								url: github.html_url,
								language: github.language,
								stars: github.stargazers_count ?? 0,
								forks: github.forks_count ?? 0,
								pushedAt: github.pushed_at
							};
						}
					} catch {
						// GitHub metadata is optional; keep the project usable if GitHub is unavailable.
					}
				}
			}

			items.push(post);
			if (metadata.techstack && Array.isArray(metadata.techstack)) allTechstacks = allTechstacks.concat(metadata.techstack);
		}
	}

	const uniqueTechstacks = ['All Projects', ...new Set(allTechstacks)];

	setHeaders({ 'Cache-Control': 'public, max-age=3600, s-maxage=86400' });

	return { items, techstacks: uniqueTechstacks };
};
