import {onDestroy} from 'svelte';
import type {Writable} from 'svelte/store';

/**
 * Bind a store to a Svelte state variable. The updater and watcher functions
 * are required to inform the Svelte compiler that updates on the state
 * variable should be tied to updates on the store.
 * @param valueStore The store to bind the Svelte state variable to.
 * @param updater Pass a function to update the Svelte state variable.
 * @returns A function to watch for changes to the Svelte state variable.
 *
 * Call it with a reactive assignment:
 * ```
 * export let value;
 * const valueStore = writable(false);
 * const watchValue = bindStore(valueStore, (newValue) => (value = newValue));
 * $: watch(value);
 * ```
 */
export function bindStore<TValue>(
	valueStore: Writable<TValue>,
	updater: (value: TValue) => void,
) {
	onDestroy(
		valueStore.subscribe(($value) => {
			updater($value);
		}),
	);
	return (value?: TValue) => {
		if (value != null) {
			valueStore.set(value);
		}
	};
}
