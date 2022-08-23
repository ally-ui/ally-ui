import type {DevOptions} from '@ally-ui/core';
import {
	DialogModel,
	type DialogModelOptions,
	type DialogModelState,
} from '@ally-ui/core-dialog';
import {useSyncOption} from '@ally-ui/vue';
import {nextTick, ref, watchEffect, type Ref} from 'vue';

export interface UseDialogOptions extends DialogModelOptions {
	openRef?: Ref<boolean | undefined>;
}

export type UseDialogValue = [DialogModel, Ref<DialogModelState>];

export default function useDialog(
	{openRef, initialOpen}: UseDialogOptions = {},
	devOptions: DevOptions = {},
): UseDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen}, devOptions);

	const state = ref(model.initialState);

	const updateOpen = useSyncOption<boolean>(openRef, (open) => {
		state.value = {...state.value, open};
	});

	watchEffect(function onInternalChange() {
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
		updateOpen(state.value.open);
	});

	model.setUIOptions({
		flushDOM: nextTick,
	});

	return [model, state];
}
