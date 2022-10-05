import {writable, type Writable} from 'svelte/store';
import {
	FocusTrapModel,
	FocusTrapModelProps,
	FocusTrapModelEvents,
} from '../lib/FocusTrapModel';

/**
 * Use Svelte Stores as the state implementation when testing the focus trap.
 * @param props The props for the focus trap.
 * @param events The events for the focus trap.
 * @param manualProps An optional opt-in to manually control the focus trap.
 * @returns A controlled focus trap instance.
 */
export function observableFocusTrap(
	props: FocusTrapModelProps = {},
	events: FocusTrapModelEvents = {},
	manualProps?: Writable<FocusTrapModelProps>,
): FocusTrapModel {
	const trap = new FocusTrapModel(props, events);

	const propsStore = manualProps ?? writable(trap.props.value);

	trap.props.requestUpdate = (updater) => {
		if (updater instanceof Function) {
			propsStore.update(updater);
		} else {
			propsStore.set(updater);
		}
	};

	propsStore.subscribe(($props) => {
		trap.props.setValue($props);
	});

	return trap;
}
