import {KNOWN_FRAMEWORKS, KNOWN_FRAMEWORK_CODES} from '../config';

export function isFramework(
	framework?: string | undefined,
): framework is keyof typeof KNOWN_FRAMEWORKS {
	return KNOWN_FRAMEWORK_CODES.includes(
		framework as keyof typeof KNOWN_FRAMEWORKS,
	);
}
