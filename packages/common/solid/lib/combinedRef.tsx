import type {CallbackRef} from './types';

export function combinedRef<TInstance>(
	...refs: (CallbackRef<TInstance> | undefined)[]
) {
	return (instance: TInstance) => refs.forEach((ref) => ref?.(instance));
}
