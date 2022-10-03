import React from 'react';
import {useRunOnce} from './useRunOnce.react';

export interface UseSyncedOptionOptions<TOption> {
	/**
	 * The external option value.
	 */
	option?: TOption;
	/**
	 * The internal option value. This should be derived from internal state.
	 */
	internal?: TOption;
	/**
	 * Called with the new external option's value when it changes.
	 *
	 * Pass a function to update internal state.
	 */
	onOptionChange: React.Dispatch<TOption>;
	/**
	 * Called with the new internal option's value when it changes.
	 *
	 * Pass a function to update the external option.
	 */
	onInternalChange?: React.Dispatch<TOption>;
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
	useRunOnce(() => {
		if (option == null) {
			return;
		}
		if (option === internal) {
			return;
		}
		onOptionChange(option);
	});
	const previousOption = React.useRef(option);
	React.useEffect(
		function updateInternal() {
			if (option == null) {
				return;
			}
			// Prevent an infinite update cycle.
			if (option === previousOption.current) {
				return;
			}
			previousOption.current = option;
			onOptionChange(option);
		},
		[option],
	);
	React.useEffect(
		function updateOption() {
			if (internal != null) {
				onInternalChange?.(internal);
			}
		},
		[internal],
	);
}
