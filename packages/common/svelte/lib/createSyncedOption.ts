import {onDestroy} from 'svelte';
import {get, type Readable} from 'svelte/store';
import {isWritable, type ReadOrWritable} from './store';

export interface CreateSyncedOptionOptions<TOption> {
	/**
	 * A writable store containing the external option value.
	 */
	option?: ReadOrWritable<TOption>;
	/**
	 * The internal option value. This should be derived from internal state.
	 */
	internal: Readable<TOption>;
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
export function createSyncedOption<TOption>({
	option,
	internal,
	onOptionChange,
}: CreateSyncedOptionOptions<TOption>) {
	let previousOption = option === undefined ? undefined : get(option);
	if (previousOption !== undefined) {
		onOptionChange(previousOption);
	}
	const unsubcribeOption = option?.subscribe(($option) => {
		if ($option === previousOption) {
			return;
		}
		previousOption = $option;
		onOptionChange($option);
	});
	const unsubcribeInternal = internal.subscribe(($internal) => {
		if (isWritable(option)) {
			option.set($internal);
		}
	});
	onDestroy(() => {
		unsubcribeInternal();
		unsubcribeOption?.();
	});
}
