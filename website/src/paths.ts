import {KNOWN_FRAMEWORK_CODES, type KNOWN_LANGUAGE_CODES} from './config';

export const LANG_REGEX = /\/([a-z]{2}-?[A-Z]{0,2})\//;

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(LANG_REGEX);
	const langCode = langCodeMatch ? langCodeMatch[1] : 'en';
	return langCode as typeof KNOWN_LANGUAGE_CODES[number];
}

export function getFrameworkFromURL(pathname: string) {
	const tokens = pathname.split('/');
	const framework = tokens.at(-1);
	if (framework === undefined) return undefined;
	if (
		KNOWN_FRAMEWORK_CODES.includes(
			framework as typeof KNOWN_FRAMEWORK_CODES[number],
		)
	) {
		return framework;
	}
	return undefined;
}
