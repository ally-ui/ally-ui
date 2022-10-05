import {writable, type Writable} from 'svelte/store';
import {
	FocusTrapModel,
	type FocusTrapModelProps,
	type FocusTrapModelEvents,
	type FocusTrapModelState,
} from '../lib/FocusTrapModel';

/**
 * Use Svelte Stores as the state implementation when testing the focus trap.
 * @param props The props for the focus trap.
 * @param events The events for the focus trap.
 * @param manualState An optional opt-in to manually control the focus trap.
 * @returns A controlled focus trap instance.
 */
export function observableFocusTrap(
	props: FocusTrapModelProps = {},
	events: FocusTrapModelEvents = {},
	manualState?: Writable<FocusTrapModelState>,
): FocusTrapModel {
	const trap = new FocusTrapModel(props, events);

	const state = manualState ?? writable(trap.state.value);

	trap.state.requestUpdate = (updater) => {
		if (updater instanceof Function) {
			state.update(updater);
		} else {
			state.set(updater);
		}
	};

	state.subscribe(($props) => {
		trap.state.setValue($props);
	});

	return trap;
}
