type AnyProps = Record<string, any>;

export function mergeVueProps(slotProps: AnyProps, childProps: AnyProps) {
	// All child props should override.
	const overrideProps = {...childProps};

	for (const propName in childProps) {
		const slotPropValue = slotProps[propName];
		const childPropValue = childProps[propName];

		if (propName === 'style') {
			overrideProps[propName] = {
				...slotPropValue,
				...childPropValue,
			};
		} else if (propName === 'class') {
			overrideProps[propName] = mergeClass(slotPropValue, childPropValue);
		}
	}

	return {...slotProps, ...overrideProps};
}

type VueClassItem = string | Record<string, boolean>;
type VueClass = VueClassItem | VueClassItem[];

export function mergeClass(
	slotClass: VueClass,
	childClass: VueClass,
): VueClass {
	if (!Array.isArray(slotClass)) slotClass = [slotClass];
	if (!Array.isArray(childClass)) childClass = [childClass];
	let stringClasses: string[] = [];
	const objectClasses: Record<string, boolean> = {};
	slotClass.forEach((c) => {
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
