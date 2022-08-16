import {DialogModel, type DialogModelOptions} from '@ally-ui/core-dialog';
import {isWritable, type ReadOrWritable} from '@ally-ui/svelte-utils';
import {tick} from 'svelte';
import {get, readable, writable, type Readable} from 'svelte/store';

export interface CreateDialogOptions extends DialogModelOptions {
	open?: ReadOrWritable<boolean>;
}

export default function createDialog({
	initialOpen,
	open,
}: CreateDialogOptions = {}): Readable<DialogModel> {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen});

	const state = writable(model.initialState);

	let previousOpen = open === undefined ? undefined : get(open);
	if (previousOpen !== undefined) {
		const open = previousOpen;
		state.update((prevState) => ({...prevState, open}));
	}

	const modelStore = readable(model, (set) => {
		const unsubscribeState = state.subscribe(($state) => {
			model.setOptions((prevOptions) => ({
				...prevOptions,
				state: $state,
				onStateChange: (updater) => {
					if (updater instanceof Function) {
						state.update(updater);
					} else {
						state.set(updater);
					}
				},
			}));
			// update options (open)
			if (isWritable(open)) {
				open.set($state.open);
			}
			set(model);
		});
		// update internal (open)
		const unsubscribeOpen = open?.subscribe(($open) => {
			if ($open === undefined) {
				return;
			}
			if ($open === previousOpen) {
				return;
			}
			previousOpen = $open;
			state.update((prevState) => ({
				...prevState,
				open: $open,
			}));
		});

		return () => {
			unsubscribeState();
			unsubscribeOpen?.();
		};
	});

	model.setUIOptions({
		waitForDOM: tick,
	});

	return modelStore;
}
