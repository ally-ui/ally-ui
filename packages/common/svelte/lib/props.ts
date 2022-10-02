import {styleString} from './styleObject';

/**
 * Handles type differences between the core model attributes and Svelte's
 * attributes.
 *
 * e.g. style is an `object` of kebab-case properties but Svelte expects a
 * `string`.
 */
type SvelteProps<TProps extends object> = {
	[TKey in keyof TProps]: TKey extends 'style' ? string : TProps[TKey];
};

/**
 * Translates the core model attributes to Svelte attributes.
 *
 * e.g. style is an `object` of kebab-case properties but Svelte expects a
 * `string`.
 */
export function svelteProps<TProps extends object>(
	props: TProps,
): SvelteProps<TProps> {
	if ((props as any).style != null) {
		(props as any).style = styleString((props as any).style);
	}
	return props as SvelteProps<TProps>;
}
