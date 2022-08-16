import {get, type Unsubscriber} from 'svelte/store';
import {isWritable, type ReadOrWritable} from './store';

/**
 * Synchronize state between an externally managed option and internal state.
 */
export default function syncOption<TOption>(
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
