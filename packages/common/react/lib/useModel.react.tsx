import type {
	ComponentModel,
	NodeComponentModel,
	Stateful,
	Updater,
} from '@ally-ui/core';
import React from 'react';

export function useStateful<TValue>(
	stateful: Stateful<TValue>,
): [TValue, React.Dispatch<Updater<TValue>>] {
	const [value, setValue] = React.useState(stateful.initialValue);
	stateful.requestUpdate = setValue;
	React.useEffect(
		function onValueUpdate() {
			stateful.setValue(value);
		},
		[value],
	);
	return [value, setValue];
}

type State<TModel extends ComponentModel> = TModel extends ComponentModel<
	any,
	infer TState
>
	? TState
	: never;

export function useComponentModel<TModel extends ComponentModel>(
	model: TModel,
): [State<TModel>, React.Dispatch<Updater<State<TModel>>>] {
	const [state, setState] = useStateful<State<TModel>>(model.state);

	React.useEffect(
		function mount() {
			// model.register();
			model.mount();
			return () => {
				model.unmount();
				// model.unregister();
			};
		},
		[model],
	);

	return [state, setState];
}

export function useNodeComponentModel<TModel extends NodeComponentModel>(
	model: TModel,
): [
	React.RefCallback<HTMLElement>,
	State<TModel>,
	React.Dispatch<Updater<State<TModel>>>,
] {
	const [state, setState] = useComponentModel(model);

	const bindRef = React.useCallback(
		(node: HTMLElement | null) => {
			if (node == null) {
				model.unbind();
			} else {
				model.bind(node);
			}
		},
		[model],
	);

	return [bindRef, state, setState];
}
