import {forwardEvent, styleObject} from './main';

type AnyProps = Record<string, any>;

export function mergeSolidProps(parentProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const parentPropValue = parentProps[propName];
		const childPropValue = childProps[propName];

		const isHandler = /^on[A-Z]/.test(propName);
		// If it's a handler, modify the override by composing the base handler.
		if (isHandler) {
			overrideProps[propName] = (ev: any) => {
				forwardEvent(ev, childPropValue);
				forwardEvent(ev, parentPropValue);
			};
		} else if (propName === 'style') {
			overrideProps[propName] = {
				...styleObject(parentPropValue),
				...styleObject(childPropValue),
			};
		} else if (propName === 'class' || propName === 'className') {
			overrideProps[propName] = [parentPropValue, childPropValue]
				.filter(Boolean)
				.join(' ');
		} else if (propName === 'classList') {
			overrideProps[propName] = {...parentPropValue, ...childPropValue};
		}
	}

	return {...parentProps, ...overrideProps};
}
