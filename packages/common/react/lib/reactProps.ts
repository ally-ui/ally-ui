import {kebabToCamelCaseObject} from '@ally-ui/core';

/**
 * Translates the core model attributes to React attributes.
 *
 * e.g. style is an `object` of kebab-case properties but React expects an
 * `object` of camelCase properties.
 */
export function reactProps<TProps extends object>(props: TProps): TProps {
	if (typeof (props as any).style === 'object') {
		(props as any).style = kebabToCamelCaseObject((props as any).style);
	}
	return props;
}
