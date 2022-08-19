import {getContext, setContext} from 'svelte';

interface Context<TValue> {
	key: Symbol;
	get(): TValue;
	set(value: TValue): TValue;
}

const createContext = <TValue>(description?: string): Context<TValue> => {
	const key = Symbol(description);
	const get = (): TValue => getContext(key);
	const set = (value: TValue) => setContext(key, value);
	return {key, get, set};
};

export default createContext;
