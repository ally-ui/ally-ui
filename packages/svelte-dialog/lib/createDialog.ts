import {DialogModel, type DialogModelOptions} from '@ally-ui/core-dialog';
import {
	isWritable,
	syncOption,
	type ReadOrWritable,
} from '@ally-ui/svelte-utils';
import {tick} from 'svelte';
import {
	get,
	readable,
	writable,
	type Readable,
	type Unsubscriber,
} from 'svelte/store';

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

	const [updateOpen, watchOpen] = syncOption(open, (open) => {
		state.update((prevState) => ({...prevState, open}));
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
		waitForDOM: tick,
	});

	return modelStore;
}
