import {getContext, setContext} from 'svelte';

export function createContext<TValue>(name: string) {
	const KEY = Symbol(name);
	const get = () => getContext(KEY) as TValue;
	const set = (value: TValue) => setContext(KEY, value);
	return [get, set] as const;
}
