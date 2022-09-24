import type {KNOWN_LANGUAGES} from '../config';

export const LANG_REGEX = /\/([a-z]{2}-?[A-Z]{0,2})\//;

export function parseLanguage(location: string) {
	const tokens = location.match(LANG_REGEX);
	const language = tokens ? tokens[1]! : 'en';
	return language as keyof typeof KNOWN_LANGUAGES;
}

export function withLanguage(location: string, newLanguage: string): string {
	let actualDest = location.replace(LANG_REGEX, '/');
	return '/' + newLanguage + actualDest;
}

export function withFramework(
	location: string,
	oldFramework: string,
	newFramework: string,
): string {
	// Replace the last occurrence of the current framework in the path.
	const pathTokens = location
		.split('/')
		.reverse()
		.filter((token) => token !== '');
	const tokenIdx = pathTokens.findIndex((token) => token === oldFramework);
	pathTokens[tokenIdx] = newFramework;
	return pathTokens.reverse().join('/');
}

export function withVersion(
	location: string,
	oldVersion: string | undefined,
	newVersion: string,
	latestVersion: string,
): string {
	const pathTokens = location.split('/').filter((token) => token !== '');
	const tokenIdx = pathTokens.findIndex((token) => token === oldVersion);
	// On the latest version already.
	if (tokenIdx === -1) {
		if (newVersion === latestVersion) return location;
		pathTokens.push(newVersion);
	} else {
		if (newVersion === latestVersion) {
			pathTokens.pop();
		} else {
			pathTokens[tokenIdx] = newVersion;
		}
	}
	return pathTokens.join('/');
}
