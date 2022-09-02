import {watchEffect, type Ref} from 'vue';

export interface UseSyncedOptionOptions<TOption> {
	/**
	 * A ref of the external option value.
	 */
	option?: Ref<TOption | undefined>;
	/**
	 * A ref of the internal option value. This should be derived from internal state.
	 */
	internal?: Ref<TOption>;
	/**
	 * Called with the new external option's value when it changes.
	 *
	 * Pass a function to update internal state.
	 */
	onOptionChange: (option: TOption) => void;
	/**
	 * Called with the new internal option's value when it changes.
	 *
	 * Pass a function to update the external option.
	 */
	onInternalChange?: (internal: TOption) => void;
}

/**
 * Synchronize state between an external option and internal state.
 */
export function useSyncedOption<TOption>({
	option,
	internal,
	onOptionChange,
	onInternalChange,
}: UseSyncedOptionOptions<TOption>) {
	let previousOption = option?.value;
	if (previousOption !== undefined) {
		onOptionChange(previousOption);
	}
	watchEffect(function updateInternal() {
		if (option?.value === undefined) {
			return;
		}
		if (option.value === previousOption) {
			return;
		}
		onOptionChange(option.value);
		previousOption = option.value;
	});
	watchEffect(function updateOption() {
		if (option === undefined) {
			return;
		}
		if (internal === undefined) {
			return;
		}
		if (internal.value === previousOption) {
			return;
		}
		onInternalChange?.(internal.value);
		previousOption = internal.value;
	});
}
