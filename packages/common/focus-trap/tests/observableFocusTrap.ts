import {writable, type Writable} from 'svelte/store';
import {
	FocusTrapModel,
	FocusTrapOptions,
	FocusTrapState,
} from '../lib/FocusTrapModel';

/**
 * Use Svelte Stores as the state implementation when testing the focus trap.
 * @param options The options for the focus trap.
 * @param manualState An optional opt-in to manually control the focus trap.
 * @returns A controlled focus trap instance.
 */
export function observableFocusTrap(
	options: FocusTrapOptions,
	manualState?: Writable<FocusTrapState>,
): FocusTrapModel {
	const trap = new FocusTrapModel(options);

	const stateStore = manualState ?? writable(trap.initialState);

	trap.requestStateUpdate = (updater) => {
		if (updater instanceof Function) {
			stateStore.update(updater);
		} else {
			stateStore.set(updater);
		}
	};

	stateStore.subscribe(($state) => {
		trap.setState($state);
	});

	return trap;
}
