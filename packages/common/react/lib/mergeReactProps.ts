type AnyProps = Record<string, any>;

export function mergeReactProps(parentProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const parentPropValue = parentProps[propName];
		const childPropValue = childProps[propName];

		const isHandler = /^on[A-Z]/.test(propName);
		// If it's a handler, modify the override by composing the base handler.
		if (isHandler) {
			overrideProps[propName] = (...args: unknown[]) => {
				childPropValue?.(...args);
				parentPropValue?.(...args);
			};
		} else if (propName === 'style') {
			overrideProps[propName] = {...parentPropValue, ...childPropValue};
		} else if (propName === 'className') {
			overrideProps[propName] = [parentPropValue, childPropValue]
				.filter(Boolean)
				.join(' ');
		}
	}

	return {...parentProps, ...overrideProps};
}
