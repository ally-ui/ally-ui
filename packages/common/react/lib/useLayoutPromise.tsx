import React from 'react';

/**
 * Get a Promise that resolves when the layout effects of some state is committed.
 * @param deps The state to wait on update for.
 * @returns A getter of a Promise that resolves when the layout effects of `deps` is committed.
 */
export function useLayoutPromise(
	deps: React.DependencyList,
): () => Promise<void> {
	const savedWaitForDOMResolves = React.useRef<Function[]>([]);
	React.useEffect(function resolveWaitForDOMOnStateUpdate() {
		savedWaitForDOMResolves.current.forEach((resolve) => resolve());
	}, deps);
	const effectsReady = React.useRef(false);
	React.useEffect(function onEffectsReady() {
		effectsReady.current = true;
	}, []);
	return React.useCallback(() => {
		if (effectsReady.current) {
			return new Promise((resolve) => {
				savedWaitForDOMResolves.current.push(resolve);
			});
		} else {
			return Promise.resolve();
		}
	}, []);
}
