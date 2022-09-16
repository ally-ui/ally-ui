import React from 'react';

/**
 * Run a function once **during render**.
 * @param runner The function to run.
 * @returns The value returned by `runner`.
 */
export function useRunOnce<TReturn>(runner: () => TReturn) {
	const [value] = React.useState(runner);
	return value;
}
