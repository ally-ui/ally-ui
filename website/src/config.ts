export const SITE = {
	title: 'Ally UI',
	description:
		'An agnostic and accessible component library for all UI frameworks',
	defaultLanguage: 'en_US',
};

// TODO Use Ally UI Open Graph data.
export const OPEN_GRAPH = {
	image: {
		src: 'https://github.com/withastro/astro/blob/main/assets/social/banner.jpg?raw=true',
		alt:
			'astro logo on a starry expanse of space,' +
			' with a purple saturn-like planet floating in the right foreground',
	},
	twitter: 'ally_ui',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
	title: string;
	description: string;
	layout: string;
	tableOfContentsMaxDepth?: number;
	image?: {src: string; alt: string};
	dir?: 'ltr' | 'rtl';
	ogLocale?: string;
	lang?: string;
};

export const KNOWN_LANGUAGES = {
	English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/ally-ui/ally-ui/tree/main/website`;

export const COMMUNITY_INVITE_URL = `https://discord.gg/VUgBbmQeMv`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
	indexName: 'XXXXXXXXXX',
	appId: 'XXXXXXXXXX',
	apiKey: 'XXXXXXXXXX',
};

export type Sidebar = Record<
	typeof KNOWN_LANGUAGE_CODES[number],
	Record<string, {text: string; link: string}[]>
>;
export const SIDEBAR: Sidebar = {
	en: {
		Overview: [{text: 'Introduction', link: 'en/overview/introduction'}],
		Widgets: [{text: 'Dialog', link: 'en/widgets/dialog'}],
	},
};
