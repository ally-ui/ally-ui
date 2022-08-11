import {TObservable} from '@ally-ui/observable';
import {useCallback, useEffect, useRef, useState} from 'react';

export default function useObservable<TValue>(
	observable: TObservable<TValue>,
	onChange?: (newValue: TValue, oldValue: TValue) => void,
) {
	const [value, setValue] = useState<TValue>(observable.unsafeValue);
	const previousValue = useRef(observable.unsafeValue);
	const savedOnChange = useCallback(
		(newValue: TValue, oldValue: TValue) => onChange?.(newValue, oldValue),
		[onChange],
	);
	useEffect(
		function subscribe() {
			return observable.subscribe((newValue) => {
				savedOnChange(newValue, previousValue.current);
				setValue(newValue);
				previousValue.current = newValue;
			});
		},
		[observable],
	);
	return value;
}
