import type {Stateful, ComponentModel, NodeComponentModel} from '@ally-ui/core';
import {onMounted, onUnmounted, ref, watchEffect, type Ref} from 'vue';

export function useStateful<TValue>(stateful: Stateful<TValue>): Ref<TValue> {
	const value = ref(stateful.initialValue) as Ref<TValue>;
	stateful.requestUpdate = (updater) => {
		value.value = updater instanceof Function ? updater(value.value) : updater;
	};
	watchEffect(function onStateUpdate() {
		stateful.setValue(value.value);
	});
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
): Ref<State<TModel>> {
	const state = useStateful(model.state);

	onMounted(() => model.mount());
	onUnmounted(() => {
		model.unmount();
		model.unregister();
	});

	return state;
}

export function useNodeComponentModel<TModel extends NodeComponentModel>(
	model: TModel,
	node: Ref<HTMLElement | null>,
): Ref<State<TModel>> {
	const state = useComponentModel(model);

	watchEffect(() => {
		if (node.value == null) {
			model.unbind();
		} else {
			model.bind(node.value);
		}
	});

	return state;
}
