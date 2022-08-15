import {ResolvedOptions} from '@ally-ui/core';
import {derived, get, writable, type Writable} from 'svelte/store';
import {FocusTrapModel, FocusTrapOptions, FocusTrapState} from '../main';

/**
 * Use Svelte Stores as the state implementation when testing the focus trap.
 * @param options The options for the focus trap
 * @returns A Readable store containing the trap instance
 */
export function observableFocusTrap(
	options: Writable<FocusTrapOptions> | FocusTrapOptions,
): FocusTrapModel {
	const optionsStore = 'subscribe' in options ? options : writable(options);
	const resolvedOptions: ResolvedOptions<FocusTrapOptions, FocusTrapState> = {
		...get(optionsStore),
		state: {} as any,
		onStateChange: () => {},
	};

	const trap = new FocusTrapModel(resolvedOptions);

	const stateStore = writable(trap.initialState);
	const stateOptionsStore = derived([stateStore, optionsStore], (s) => s);

	stateOptionsStore.subscribe(([state, options]) => {
		trap.setOptions((prevOptions) => ({
			...prevOptions,
			...options,
			state,
			onStateChange: (updater) => {
				if (updater instanceof Function) {
					stateStore.update(updater);
				} else {
					stateStore.set(updater);
				}
				resolvedOptions.onStateChange(updater);
			},
		}));
	});

	return trap;
}
