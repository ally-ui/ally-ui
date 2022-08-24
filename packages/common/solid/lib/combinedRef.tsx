export default function combinedRef<TInstance>(
	...refs: ((instance: TInstance) => void)[]
) {
	return (instance: TInstance) => refs.forEach((ref) => ref(instance));
}
