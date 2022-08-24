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

export default function useDialog({
	openRef,
	initialOpen,
}: UseDialogOptions = {}): UseDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen});

	const state = ref(model.initialState);

	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: (updater) => {
			if (updater instanceof Function) {
				state.value = updater(state.value);
			} else {
				state.value = updater;
			}
		},
	}));

	const updateOpenOption = useSyncOption<boolean>(openRef, (open) => {
		state.value = {...state.value, open};
	});

	watchEffect(function onStateUpdate() {
		model.setState(state.value);
		updateOpenOption(state.value.open);
	});

	model.setUIOptions({
		flushDOM: nextTick,
	});

	return [model, state];
}
