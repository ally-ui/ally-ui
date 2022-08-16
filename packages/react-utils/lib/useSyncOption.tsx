import {useEffect, useRef, useState} from 'react';
import useRunOnce from './useRunOnce';

export interface UseSyncOptionParams<TOption> {
	option?: TOption;
	internal: TOption;
	onOptionChange: React.Dispatch<TOption>;
	onInternalChange?: React.Dispatch<TOption>;
}

/**
 * Synchronize state between an externally managed option and internal state.
 */
export default function useSyncOption<TOption>({
	option,
	internal,
	onOptionChange,
	onInternalChange,
}: UseSyncOptionParams<TOption>) {
	useRunOnce(() => {
		if (option === undefined) {
			return;
		}
		if (option === internal) {
			return;
		}
		onOptionChange(option);
	});
	const previousOption = useRef(option);
	useEffect(
		function updateInternal() {
			if (option === undefined) {
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
	useEffect(
		function updateOption() {
			onInternalChange?.(internal);
		},
		[internal],
	);
}
