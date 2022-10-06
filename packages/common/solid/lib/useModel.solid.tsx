import type {ComponentModel, NodeComponentModel, Stateful} from '@ally-ui/core';
import {createEffect, onCleanup, onMount} from 'solid-js';
import {createStore, type SetStoreFunction} from 'solid-js/store';
import {createBindRef, createDelayedBindRef} from './createBindRef.solid';

export function useStateful<TValue extends object>(
	stateful: Stateful<TValue>,
): [TValue, SetStoreFunction<TValue>] {
	const [value, setValue] = createStore<TValue>({...stateful.initialValue});
	stateful.requestUpdate = setValue;
	createEffect(function onValueUpdate() {
		stateful.setValue({...value});
	});
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
): [State<TModel>, SetStoreFunction<State<TModel>>] {
	const [state, setState] = useStateful<State<TModel>>(model.state);

	onMount(() => model.mount());
	onCleanup(() => {
		model.unmount();
		model.unregister();
	});

	return [state, setState];
}

interface UseNodeComponentModelOptions {
	delayBind?: boolean;
}

export function useNodeComponentModel<TModel extends NodeComponentModel>(
	model: TModel,
	{delayBind = false}: UseNodeComponentModelOptions = {},
): [
	(node: HTMLElement) => void,
	State<TModel>,
	SetStoreFunction<State<TModel>>,
] {
	const [state, setState] = useComponentModel(model);

	const _createBindRef = delayBind ? createDelayedBindRef : createBindRef;
	const bindRef = _createBindRef((node) => {
		if (node == null) {
			model.unbind();
		} else {
			model.bind(node);
		}
	});

	return [bindRef, state, setState];
}
