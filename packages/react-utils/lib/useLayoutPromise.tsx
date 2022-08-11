import {DependencyList, useCallback, useLayoutEffect, useRef} from 'react';

export default function useLayoutPromise(deps: DependencyList) {
	const savedWaitForDOMResolves = useRef<(() => void)[]>([]);
	useLayoutEffect(function resolveWaitForDOMOnStateUpdate() {
		savedWaitForDOMResolves.current.forEach((resolve) => resolve());
	}, deps);
	const getLayoutPromise = useCallback(() => {
		return new Promise<void>((resolve) => {
			savedWaitForDOMResolves.current.push(resolve);
		});
	}, []);
	return getLayoutPromise;
}
