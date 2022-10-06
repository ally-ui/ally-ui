import type {Stateful, ComponentModel, NodeComponentModel} from '@ally-ui/core';
import {onDestroy, onMount} from 'svelte';
import {writable, type Writable} from 'svelte/store';

export function useStateful<TValue>(
	stateful: Stateful<TValue>,
): Writable<TValue> {
	const value = writable(stateful.initialValue);
	stateful.requestUpdate = (updater) => {
		if (updater instanceof Function) {
			value.update(updater);
		} else {
			value.set(updater);
		}
	};
	onDestroy(
		value.subscribe(($value) => {
			stateful.setValue($value);
		}),
	);
	return value;
}

type State<TModel extends ComponentModel> = TModel extends ComponentModel<
	any,
	infer TState
>
	? TState
	: never;

export function useComponentModel<TModel extends ComponentModel>(
	model: TModel,
): Writable<State<TModel>> {
	const state = useStateful(model.state);

	onMount(() => {
		model.mount();
		return () => {
			model.unmount();
			model.unregister();
		};
	});

	return state;
}

export function useNodeComponentModel<TModel extends NodeComponentModel>(
	model: TModel,
): [(node: HTMLElement | null | undefined) => void, Writable<State<TModel>>] {
	const state = useComponentModel(model);

	function bindNode(node: HTMLElement | null | undefined) {
		if (node == null) {
			model.unbind();
		} else {
			model.bind(node);
		}
	}

	return [bindNode, state];
}
