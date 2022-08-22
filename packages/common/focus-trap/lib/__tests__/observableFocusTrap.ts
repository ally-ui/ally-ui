import {writable, type Writable} from 'svelte/store';
import {FocusTrapModel, FocusTrapOptions, FocusTrapState} from '../main';

/**
 * Use Svelte Stores as the state implementation when testing the focus trap.
 * @param options The options for the focus trap
 * @returns A Readable store containing the trap instance
 */
export function observableFocusTrap(
	options: FocusTrapOptions,
	manualState?: Writable<FocusTrapState>,
): FocusTrapModel {
	const trap = new FocusTrapModel('0', options);

	const stateStore = manualState ?? writable(trap.initialState);

	stateStore.subscribe(($state) => {
		trap.setOptions((prevOptions) => ({
			...prevOptions,
			state: $state,
			onStateChange: (updater) => {
				if (updater instanceof Function) {
					stateStore.update(updater);
				} else {
					stateStore.set(updater);
				}
			},
		}));
	});

	return trap;
}
