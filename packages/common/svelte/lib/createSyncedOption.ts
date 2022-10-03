import {onDestroy} from 'svelte';
import type {Readable} from 'svelte/store';

export interface CreateSyncedOptionOptions<TOption> {
	/**
	 * The initial value of the option.
	 */
	initialOption?: TOption;
	/**
	 * The internal option value. This should be derived from internal state.
	 */
	internal?: Readable<TOption>;
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
	onInternalChange?: (option: TOption) => void;
}

/**
 * Synchronize state between an external option and internal state.
 */
export function createSyncedOption<TOption>({
	initialOption,
	internal,
	onOptionChange,
	onInternalChange,
}: CreateSyncedOptionOptions<TOption>) {
	let previousOption = initialOption;
	if (previousOption != null) {
		onOptionChange(previousOption);
	}
	function watchOption(option?: TOption) {
		if (option == null) {
			return;
		}
		if (option === previousOption) {
			return;
		}
		previousOption = option;
		onOptionChange(option);
	}
	const unsubcribeInternal = internal?.subscribe(($internal) => {
		onInternalChange?.($internal);
	});
	onDestroy(() => {
		unsubcribeInternal?.();
	});
	return watchOption;
}
