import {Accessor, createEffect, untrack} from 'solid-js';

export interface CreateSyncedOptionOptions<TOption> {
	/**
	 * An accessor to the external option value.
	 */
	option: Accessor<TOption | undefined>;
	/**
	 * An accessor to the internal option value. This should be derived from internal state.
	 */
	internal?: Accessor<TOption>;
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
export function createSyncedOption<TOption>({
	option,
	internal,
	onOptionChange,
	onInternalChange,
}: CreateSyncedOptionOptions<TOption>) {
	const untrackedOption = untrack(option);
	if (
		untrackedOption !== undefined &&
		internal !== undefined &&
		untrackedOption !== untrack(internal)
	) {
		onOptionChange(untrackedOption);
	}
	let previousOption = untrackedOption;
	createEffect(
		function updateInternal() {
			const optionValue = option();
			if (optionValue === undefined) {
				return;
			}
			// Prevent an infinite update cycle.
			if (optionValue === previousOption) {
				return;
			}
			previousOption = optionValue;
			onOptionChange(optionValue);
		},
		[option],
	);
	createEffect(
		function updateOption() {
			if (internal !== undefined) {
				onInternalChange?.(internal());
			}
		},
		[internal],
	);
}
