import {onDestroy} from 'svelte';
import type {Readable} from 'svelte/store';

export interface CreateSyncedOptionOptions<TOption> {
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
	internal,
	onOptionChange,
	onInternalChange,
}: CreateSyncedOptionOptions<TOption>) {
	let previousOption: TOption | undefined = undefined;
	function watchOption(option?: TOption) {
		if (option !== undefined && option !== previousOption) {
			previousOption = option;
			onOptionChange(option);
		}
	}
	const unsubcribeInternal = internal?.subscribe(($internal) => {
		onInternalChange?.($internal);
	});
	onDestroy(() => {
		unsubcribeInternal?.();
	});
	return watchOption;
}
