import type {KNOWN_LANGUAGES} from '../config';

interface Path {
	language: keyof typeof KNOWN_LANGUAGES;
	rest: string;
}

export function parsePath(location: string): Path | undefined {
	const tokens = location.match(
		/(?<language>[a-z]{2}-?[A-Z]{0,2})\/(?<rest>[\w-\/]+)/,
	);
	if (tokens === null) return undefined;
	return {
		language: tokens.groups?.language! as keyof typeof KNOWN_LANGUAGES,
		rest: tokens.groups?.rest!,
	};
}

interface WidgetPath {
	language: keyof typeof KNOWN_LANGUAGES;
	widget: string;
	framework: string;
	version?: string;
}

export function parseWidgetPath(location: string): WidgetPath | undefined {
	const tokens = location.match(
		/(?<language>[a-z]{2}-?[A-Z]{0,2})\/widgets\/(?<widget>[\w-]+)\/(?<framework>[\w-]+)\/?(?<version>\d+\.\d+\.\d+)?\/?$/,
	);
	if (tokens === null) return undefined;
	return {
		language: tokens.groups?.language! as keyof typeof KNOWN_LANGUAGES,
		widget: tokens.groups?.widget!,
		framework: tokens.groups?.framework!,
		version: tokens.groups?.version!,
	};
}

export function parseLanguage(location: string) {
	const path = parsePath(location);
	if (path === undefined) return 'en';
	return path.language;
}

export function withLanguage(location: string, newLanguage: string): string {
	const path = parsePath(location);
	if (path === undefined) return location;
	return `/${newLanguage}/${path.rest}`;
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
