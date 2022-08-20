<script setup lang="ts">
import {DialogModel} from '@ally-ui/core-dialog';
import {
	defineProps,
	inject,
	onMounted,
	onUnmounted,
	ref,
	watchEffect,
} from 'vue';
import {modelKey, stateKey} from './context';

const props = withDefaults(
	defineProps<{
		model?: DialogModel;
	}>(),
	{},
);

const resolvedModel = props.model ?? inject(modelKey);
if (resolvedModel === undefined) {
	throw new Error(
		'<Dialog.Trigger /> must have a `model` prop or be a child of `<Dialog.Root/>`',
	);
}
const id = resolvedModel.init('trigger');

const state = inject(stateKey) ?? ref(resolvedModel.getState());

onMounted(() => resolvedModel.mount(id));
onUnmounted(() => resolvedModel.unmount(id));

const node = ref<HTMLElement | null>(null);
watchEffect(() => {
	if (node.value === null) {
		resolvedModel.unbindNode(id);
	} else {
		resolvedModel.bindNode(id, node.value);
	}
});
</script>

<template>
	<button
		ref="node"
		v-bind="resolvedModel.componentAttributes(id, state)"
		@click="
			() => resolvedModel.setState((prevState) => ({...prevState, open: true}))
		"
	>
		<slot />
	</button>
</template>
