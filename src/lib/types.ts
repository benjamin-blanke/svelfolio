export type Picture = {
	sources: Record<string, string>;
	img: { src: string; w: number; h: number };
};

export interface About {
	title: string;
	description: string;
	slug: string;
}

export interface Project {
	title: string;
	description: string;
	slug: string;
	poster: Picture;
	techstack: string[];
	github?: string;
	githubData?: {
		fullName: string;
		url: string;
		language: string | null;
		stars: number;
		forks: number;
		pushedAt: string;
	};
}
