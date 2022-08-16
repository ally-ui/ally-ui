import {DependencyList, useCallback, useEffect, useRef} from 'react';

/**
 * Get a Promise that resolves when the layout effects of some state is committed.
 * @param deps The state to wait on update for
 * @returns A getter of a Promise that resolves when the layout effects of `deps` is committed
 */
export default function useLayoutPromise(
	deps: DependencyList,
): () => Promise<void> {
	const savedWaitForDOMResolves = useRef<Function[]>([]);
	useEffect(function resolveWaitForDOMOnStateUpdate() {
		savedWaitForDOMResolves.current.forEach((resolve) => resolve());
	}, deps);
	const effectsReady = useRef(false);
	useEffect(function onEffectsReady() {
		effectsReady.current = true;
	}, []);
	return useCallback(() => {
		if (effectsReady.current) {
			return new Promise((resolve) => {
				savedWaitForDOMResolves.current.push(resolve);
			});
		} else {
			return Promise.resolve();
		}
	}, []);
}
