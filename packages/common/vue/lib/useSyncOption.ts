import {watchEffect, type Ref} from 'vue';

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
