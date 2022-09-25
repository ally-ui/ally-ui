import type {KNOWN_LANGUAGES} from './config';

interface WidgetsTranslations {
	features: string;
	installation: string;
	installation_sub: string;
	anatomy: string;
	anatomy_sub: string;
	version_latest: string;
	view_source: string;
	view_on_npm: string;
}

export const WIDGETS: Record<
	keyof typeof KNOWN_LANGUAGES,
	WidgetsTranslations
> = {
	en: {
		features: 'Features',
		installation: 'Installation',
		installation_sub: 'Use your favorite package manager.',
		anatomy: 'Anatomy',
		anatomy_sub: 'Construct the widget from component parts.',
		version_latest: 'latest',
		view_source: 'View source',
		view_on_npm: 'View on npm',
	},
	fr: {
		features: 'Capacités',
		installation: 'Installation',
		installation_sub: 'Utilisez votre gestionnaire de paquets préféré.',
		anatomy: 'Anatomie',
		anatomy_sub: 'Construire le widget à partir de composants.',
		version_latest: 'dernière',
		view_source: 'Voyez la source',
		view_on_npm: 'Voyez sur npm',
	},
};

interface ExampleTranslations {
	example_not_available: string;
	show_code: string;
}

export const EXAMPLE: Record<
	keyof typeof KNOWN_LANGUAGES,
	ExampleTranslations
> = {
	en: {
		example_not_available: 'Example not available',
		show_code: 'Show code',
	},
	fr: {
		example_not_available: 'Exemple non disponible',
		show_code: 'Afficher le code',
	},
};
