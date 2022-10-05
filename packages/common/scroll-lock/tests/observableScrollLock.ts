import {writable, type Writable} from 'svelte/store';
import {
	ScrollLockModel,
	type ScrollLockModelProps,
} from '../lib/ScrollLockModel';

/**
 * Use Svelte Stores as the state implementation when testing the scroll lock.
 * @param props The options for the scroll lock.
 * @param manualProps An optional opt-in to manually control the scroll lock.
 * @returns A controlled scroll lock instance.
 */
export function observableScrollLock(
	props: ScrollLockModelProps = {},
	manualProps?: Writable<ScrollLockModelProps>,
): ScrollLockModel {
	const lock = new ScrollLockModel(props);

	const propsStore = manualProps ?? writable(lock.props.initialValue);

	lock.props.requestUpdate = (updater) => {
		if (updater instanceof Function) {
			propsStore.update(updater);
		} else {
			propsStore.set(updater);
		}
	};

	propsStore.subscribe(($state) => {
		lock.props.setValue($state);
	});

	return lock;
}
