import {watchEffect, type Ref} from 'vue';

export interface UseSyncedOptionOptions<TOption> {
	/**
	 * A mutable ref of the external option value.
	 */
	option?: Ref<TOption | undefined>;
	/**
	 * A mutable ref of the internal option value. This should be derived from internal state.
	 */
	internal: Ref<TOption>;
	/**
	 * Called with the new external option's value when it changes.
	 *
	 * Pass a function to update internal state.
	 */
	onOptionChange: (option: TOption) => void;
}

/**
 * Synchronize state between an external option and internal state.
 */
export function useSyncedOption<TOption>({
	option,
	internal,
	onOptionChange,
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
		if (internal.value === previousOption) {
			return;
		}
		option.value = internal.value;
		previousOption = internal.value;
	});
}
