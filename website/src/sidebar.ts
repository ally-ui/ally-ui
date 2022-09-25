import type {KNOWN_LANGUAGES} from './config';

export const SECTION_LABELS: Record<
	string,
	Record<keyof typeof KNOWN_LANGUAGES, string>
> = {
	overview: {
		en: 'Overview',
		fr: 'Aperçu',
	},
	widgets: {
		en: 'Widgets',
		fr: 'Widgets',
	},
};

export const SIDEBAR_ORDER = {
	overview: ['overview/introduction'],
	widgets: ['widgets/dialog'],
};
