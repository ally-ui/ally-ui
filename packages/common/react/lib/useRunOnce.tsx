import {useState} from 'react';

/**
 * Run a function once **during render**.
 * @param runner The function to run
 * @returns The value returned by `runner`
 */
export default function useRunOnce<TReturn>(runner: () => TReturn) {
	const [value] = useState(runner);
	return value;
}
