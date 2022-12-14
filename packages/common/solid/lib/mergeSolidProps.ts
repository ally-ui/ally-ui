import {forwardEvent, styleObject} from './main';

type AnyProps = Record<string, any>;

export function mergeSolidProps(
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

			const isHandler = /^on[A-Z]/.test(propName);
			// If it's a handler, modify the override by composing the base handler.
			if (isHandler) {
				// Only compose the handlers if both exist.
				if (childPropValue && mergedPropValue) {
					overrideProps[propName] = (ev: any) => {
						forwardEvent(ev, childPropValue);
						forwardEvent(ev, mergedPropValue);
					};
					// Otherwise, avoid creating an unnecessary callback.
				} else if (mergedPropValue) {
					overrideProps[propName] = mergedPropValue;
				}
			} else if (propName === 'style') {
				overrideProps[propName] = {
					...styleObject(mergedPropValue),
					...styleObject(childPropValue),
				};
			} else if (propName === 'class' || propName === 'className') {
				overrideProps[propName] = [mergedPropValue, childPropValue]
					.filter(Boolean)
					.join(' ');
			} else if (propName === 'classList') {
				overrideProps[propName] = {...mergedPropValue, ...childPropValue};
			}
		}
		Object.assign(mergedProps, overrideProps);
	}

	return mergedProps;
}
