type AnyProps = Record<string, any>;

export function mergeSlotProps(slotProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];

		const isHandler = /^on[A-Z]/.test(propName);
		// If it's a handler, modify the override by composing the base handler.
		if (isHandler) {
			overrideProps[propName] = (...args: unknown[]) => {
				childPropValue?.(...args);
				slotPropValue?.(...args);
			};
		} else if (propName === 'style') {
			overrideProps[propName] = {...slotPropValue, ...childPropValue};
		} else if (propName === 'className') {
			overrideProps[propName] = [slotPropValue, childPropValue]
				.filter(Boolean)
				.join(' ');
		}
	}

	return {...slotProps, ...overrideProps};
}
