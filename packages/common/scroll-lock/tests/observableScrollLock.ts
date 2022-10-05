import {writable, type Writable} from 'svelte/store';
import {
	ScrollLockModel,
	type ScrollLockModelOptions,
	type ScrollLockModelState,
} from '../lib/ScrollLockModel';

/**
 * Use Svelte Stores as the state implementation when testing the scroll lock.
 * @param options The options for the scroll lock.
 * @param manualState An optional opt-in to manually control the scroll lock.
 * @returns A controlled scroll lock instance.
 */
export function observableScrollLock(
	options: ScrollLockModelOptions = {},
	manualState?: Writable<ScrollLockModelState>,
): ScrollLockModel {
	const lock = new ScrollLockModel(options);

	const stateStore = manualState ?? writable(lock.initialState);

	lock.requestStateUpdate = (updater) => {
		if (updater instanceof Function) {
			stateStore.update(updater);
		} else {
			stateStore.set(updater);
		}
	};

	stateStore.subscribe(($state) => {
		lock.setState($state);
	});

	return lock;
}
