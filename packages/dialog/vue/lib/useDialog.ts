import type {DevOptions} from '@ally-ui/core';
import {
	DialogModel,
	DialogModelState,
	type DialogModelOptions,
} from '@ally-ui/core-dialog';
import {computed} from '@vue/reactivity';
import {nextTick, ref, watchEffect, type Ref} from 'vue';

export interface UseDialogOptions extends DialogModelOptions {
	open?: Ref<boolean>;
}

export type UseDialogValue = [DialogModel, Ref<DialogModelState>];

export interface UseSyncOptionOptions<TOption> {
	option?: Ref<TOption>;
	internal: Ref<TOption>;
	onOptionChange: (option: TOption) => void;
	onInternalChange?: (option: TOption) => void;
}

function useSyncOption<TOption>({
	option,
	internal,
	onOptionChange,
	onInternalChange,
}: UseSyncOptionOptions<TOption>) {
	if (option !== undefined && option.value !== internal.value) {
		onOptionChange(option.value);
	}
	let previousOption = option?.value;
	watchEffect(function updateInternal() {
		if (option?.value === undefined) {
			return;
		}
		// Prevent an infinite update cycle.
		if (option.value === previousOption) {
			return;
		}
		previousOption = option.value;
		onOptionChange(option.value);
	});
	watchEffect(function updateOption() {
		onInternalChange?.(internal.value);
	});
}

export default function useDialog(
	{initialOpen, open}: UseDialogOptions = {},
	devOptions: DevOptions = {},
): UseDialogValue {
	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen}, devOptions);

	const state = ref(model.initialState);

	useSyncOption({
		option: open,
		internal: computed(() => state.value.open),
		onOptionChange: (open) => (state.value.open = open),
		onInternalChange: (internal) =>
			open !== undefined && (open.value = internal),
	});

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
