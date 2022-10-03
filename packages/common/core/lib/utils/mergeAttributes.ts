type AnyProps = Record<string, any>;

export function mergeAttributes(
	parentProps: AnyProps,
	...manyChildProps: (AnyProps | undefined)[]
) {
	let mergedProps = {...parentProps};
	for (const childProps of manyChildProps) {
		if (childProps == null) continue;
		// All child props should override.
		const overrideProps = {...childProps};

		for (const propName in childProps) {
			const mergedPropValue = mergedProps[propName];
			const childPropValue = childProps[propName];

			if (propName === 'style') {
				overrideProps[propName] = {
					...mergedPropValue,
					...childPropValue,
				};
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
