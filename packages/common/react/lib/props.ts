import {kebabToCamelCaseObject} from '@ally-ui/core';

export function reactProps(props: any) {
	if (typeof props.style === 'object') {
		props.style = kebabToCamelCaseObject(props.style);
	}
	return props;
}
