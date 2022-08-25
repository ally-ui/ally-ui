type CallbackRef<TInstance> = (instance: TInstance) => void;

export default function combinedRef<TInstance>(
	...refs: (CallbackRef<TInstance> | undefined)[]
) {
	return (instance: TInstance) => refs.forEach((ref) => ref?.(instance));
}
