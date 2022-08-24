import {watchEffect, type Ref} from 'vue';

/**
 * Synchronize state between an external option and internal state.
 *
 * @param option A mutable ref of the external option.
 * @param onOptionChange Called with the new external option's value when it
 * changes. Pass a function to update internal state.
 *
 * @returns A function to update the external option and mitigate infinite update cycles.
 * Call it when internal state updates with the updated value of the option.
 */
export default function useSyncOption<TOption>(
	option: Ref<TOption | undefined> | undefined,
	onOptionChange: (option: TOption) => void,
) {
	let previousOption = option?.value;
	if (previousOption !== undefined) {
		onOptionChange(previousOption);
	}
	function updateOption(internal: TOption) {
		if (option === undefined) {
			return;
		}
		if (internal === previousOption) {
			return;
		}
		option.value = internal;
		previousOption = internal;
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
	return updateOption;
}
