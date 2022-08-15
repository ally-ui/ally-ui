import {DependencyList, useCallback, useLayoutEffect, useRef} from 'react';

export default function useLayoutPromise(
	deps: DependencyList,
): () => Promise<void> {
	const savedWaitForDOMResolves = useRef<Function[]>([]);
	useLayoutEffect(function resolveWaitForDOMOnStateUpdate() {
		savedWaitForDOMResolves.current.forEach((resolve) => resolve());
	}, deps);
	return useCallback(() => {
		return new Promise((resolve) => {
			savedWaitForDOMResolves.current.push(resolve);
		});
	}, []);
}
