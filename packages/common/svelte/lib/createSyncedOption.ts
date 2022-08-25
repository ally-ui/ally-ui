import {get, type Unsubscriber} from 'svelte/store';
import {isWritable, type ReadOrWritable} from './store';

/**
 * Synchronize state between an external option and internal state.
 *
 * @param option A writable store containing the external option value.
 * @param onOptionChange Called with the new external option's value when it
 * changes. Pass a function to update internal state.
 *
 * @returns A pair of functions.
 *
 * The first function updates the external option and mitigates infinite update
 * cycles. Call it when internal state updates with the updated value of the
 * option.
 *
 * The second function starts a subscriber on the option store to update
 * internal state when it updates. It returns an unsubscriber for cleanup.
 */
export default function createSyncedOption<TOption>(
	option: ReadOrWritable<TOption> | undefined,
	onOptionChange: (option: TOption) => void,
) {
	let previousOption = option === undefined ? undefined : get(option);
	if (previousOption !== undefined) {
		onOptionChange(previousOption);
	}
	function updateOption(internal: TOption) {
		if (isWritable(option)) {
			option.set(internal);
		}
	}
	function watchOption(): Unsubscriber | undefined {
		return option?.subscribe(($option) => {
			if ($option === previousOption) {
				return;
			}
			previousOption = $option;
			onOptionChange($option);
		});
	}
	return [updateOption, watchOption] as const;
}
