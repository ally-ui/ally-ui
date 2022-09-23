import type {KNOWN_LANGUAGE_CODES} from './config';

export const LANG_REGEX = /\/([a-z]{2}-?[A-Z]{0,2})\//;

export function getLanguageFromURL(pathname: string) {
	const langCodeMatch = pathname.match(LANG_REGEX);
	const langCode = langCodeMatch ? langCodeMatch[1] : 'en';
	return langCode as typeof KNOWN_LANGUAGE_CODES[number];
}
