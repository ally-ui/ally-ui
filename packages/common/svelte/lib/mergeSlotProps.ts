import {styleObject, styleString} from './main';

type AnyProps = Record<string, any>;

export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];

		if (propName === 'style') {
			overrideProps[propName] = styleString({
				...styleObject(slotPropValue),
				...styleObject(childPropValue),
			});
		} else if (propName === 'class') {
			overrideProps[propName] = [slotPropValue, childPropValue]
				.filter(Boolean)
				.join(' ');
		}
	}

	return {...slotProps, ...overrideProps};
}
