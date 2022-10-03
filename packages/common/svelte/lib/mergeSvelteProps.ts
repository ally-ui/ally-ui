import {styleObject, styleString} from './main';

type AnyProps = Record<string, any>;

export function mergeSvelteProps(
	parentProps: AnyProps,
	...manyChildProps: AnyProps[]
) {
	let mergedProps = {...parentProps};
	for (const childProps of manyChildProps) {
		// All child props should override.
		const overrideProps = {...childProps};

		for (const propName in childProps) {
			const mergedPropValue = mergedProps[propName];
			const childPropValue = childProps[propName];

			if (propName === 'style') {
				overrideProps[propName] = styleString({
					...styleObject(mergedPropValue),
					...styleObject(childPropValue),
				});
			} else if (propName === 'class') {
				overrideProps[propName] = [mergedPropValue, childPropValue]
					.filter(Boolean)
					.join(' ');
			}
		}

		Object.assign(mergedProps, overrideProps);
	}
	return mergedProps;
}
