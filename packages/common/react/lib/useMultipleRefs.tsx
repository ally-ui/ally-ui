import {MutableRefObject, Ref, useCallback} from 'react';

/**
 * Handles setting callback refs and MutableRefObjects.
 * @param ref The ref to use for the instance
 * @param instance The instance being set
 */
function setRef<TInstance>(ref: Ref<TInstance>, instance: TInstance) {
	if (ref instanceof Function) {
		ref(instance);
	} else if (ref !== null) {
		(ref as MutableRefObject<TInstance>).current = instance;
	}
}

function combinedRef<TInstance>(refs: Ref<TInstance>[]) {
	return (instance: TInstance | null) =>
		refs.forEach((ref) => setRef(ref, instance));
}

/**
 * Get a Promise that resolves when the layout effects of some state is committed.
 * @param deps The state to wait on update for
 * @returns A getter of a Promise that resolves when the layout effects of `deps` is committed
 */

/**
 * Create a ref that passes its instance to multiple refs.
 * @param refs The refs that should receive the instance
 * @returns The combined ref
 */
export default function useMultipleRefs<TInstance>(...refs: Ref<TInstance>[]) {
	return useCallback(combinedRef(refs), refs);
}
