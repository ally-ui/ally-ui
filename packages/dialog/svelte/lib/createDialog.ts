import {DialogModel, type DialogModelOptions} from '@ally-ui/core-dialog';
import {createSyncedOption} from '@ally-ui/svelte';
import {readable, writable, type Readable, type Writable} from 'svelte/store';

export interface CreateDialogOptions extends DialogModelOptions {
	openStore?: Writable<boolean>;
}

export function createDialog({
	initialOpen,
	openStore,
}: CreateDialogOptions = {}): Readable<DialogModel> {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen});

	const state = writable(model.initialState);

	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: (updater) => {
			if (updater instanceof Function) {
				state.update(updater);
			} else {
				state.set(updater);
			}
		},
	}));

	const [updateOpenOption, watchOpenOption] = createSyncedOption(
		openStore,
		($open) => {
			state.update((prevState) => ({...prevState, open: $open}));
		},
	);

	const modelStore = readable(model, (set) => {
		const unsubscribeState = state.subscribe(($state) => {
			model.setState($state);
			updateOpenOption($state.open);
			set(model);
		});

		const unsubscribeOpen = watchOpenOption();

		return () => {
			unsubscribeState();
			unsubscribeOpen?.();
		};
	});

	return modelStore;
}
