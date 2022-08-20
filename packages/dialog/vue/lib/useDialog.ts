import type {DevOptions} from '@ally-ui/core';
import {
	DialogModel,
	DialogModelState,
	type DialogModelOptions,
} from '@ally-ui/core-dialog';
import {nextTick, ref, watchEffect, type Ref} from 'vue';

export interface UseDialogOptions extends DialogModelOptions {
	open?: Ref<boolean>;
}

export type UseDialogValue = [DialogModel, Ref<DialogModelState>];

export default function useDialog(
	{initialOpen, open}: UseDialogOptions = {},
	devOptions: DevOptions = {},
): UseDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen}, devOptions);

	const state = ref(model.initialState);

	watchEffect(() => {
		model.setOptions((prevOptions) => {
			return {
				...prevOptions,
				state: state.value,
				onStateChange: (updater) => {
					if (updater instanceof Function) {
						state.value = updater(state.value);
					} else {
						state.value = updater;
					}
				},
			};
		});
	});

	model.setUIOptions({
		flushDOM: nextTick,
	});

	return [model, state];
}
