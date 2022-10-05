import {writable, type Writable} from 'svelte/store';
import {
	ScrollLockModel,
	type ScrollLockModelState,
	type ScrollLockModelProps,
} from '../lib/ScrollLockModel';

/**
 * Use Svelte Stores as the state implementation when testing the scroll lock.
 * @param props The options for the scroll lock.
 * @param manualState An optional opt-in to manually control the scroll lock.
 * @returns A controlled scroll lock instance.
 */
export function observableScrollLock(
	props: ScrollLockModelProps = {},
	manualState?: Writable<ScrollLockModelState>,
): ScrollLockModel {
	const lock = new ScrollLockModel(props);

	const propsStore = manualState ?? writable(lock.state.initialValue);

	lock.state.requestUpdate = (updater) => {
		if (updater instanceof Function) {
			propsStore.update(updater);
		} else {
			propsStore.set(updater);
		}
	};

	propsStore.subscribe(($state) => {
		lock.state.setValue($state);
	});

	return lock;
}
