type AnyProps = Record<string, any>;

export function mergeVueProps(parentProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const slotPropValue = parentProps[propName];
		const childPropValue = childProps[propName];

		if (propName === 'style') {
			overrideProps[propName] = {
				...slotPropValue,
				...childPropValue,
			};
		} else if (propName === 'class') {
			overrideProps[propName] = mergeVueClass(slotPropValue, childPropValue);
		}
	}

	return {...parentProps, ...overrideProps};
}

type VueClassItem = string | Record<string, boolean>;
type VueClass = VueClassItem | VueClassItem[];

export function mergeVueClass(
	parentClass: VueClass,
	childClass: VueClass,
): VueClass {
	if (!Array.isArray(parentClass)) parentClass = [parentClass];
	if (!Array.isArray(childClass)) childClass = [childClass];
	let stringClasses: string[] = [];
	const objectClasses: Record<string, boolean> = {};
	parentClass.forEach((c) => {
		if (typeof c === 'object') {
			Object.assign(objectClasses, c);
		} else {
			stringClasses.push(c);
		}
	});
	childClass.forEach((c) => {
		if (typeof c === 'object') {
			Object.assign(objectClasses, c);
		} else {
			stringClasses.push(c);
		}
	});
	return [...stringClasses, objectClasses];
}
