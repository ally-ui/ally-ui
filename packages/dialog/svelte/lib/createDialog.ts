import type {DevOptions} from '@ally-ui/core';
import {DialogModel, type DialogModelOptions} from '@ally-ui/core-dialog';
import {useSyncOption, type ReadOrWritable} from '@ally-ui/svelte';
import {tick} from 'svelte';
import {readable, writable, type Readable} from 'svelte/store';

export interface CreateDialogOptions extends DialogModelOptions {
	openStore?: ReadOrWritable<boolean>;
}

export default function createDialog(
	{initialOpen, openStore}: CreateDialogOptions = {},
	devOptions: DevOptions = {},
): Readable<DialogModel> {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen}, devOptions);

	const state = writable(model.initialState);

	const [updateOpen, watchOpen] = useSyncOption(openStore, ($open) => {
		state.update((prevState) => ({...prevState, open: $open}));
	});

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
			updateOpen($state.open);
			set(model);
		});

		const unsubscribeOpen = watchOpen();

		return () => {
			unsubscribeState();
			unsubscribeOpen?.();
		};
	});

	model.setUIOptions({
		flushDOM: tick,
	});

	return modelStore;
}
