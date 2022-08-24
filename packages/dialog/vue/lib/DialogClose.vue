<script setup lang="ts">
import type {DialogModel} from '@ally-ui/core-dialog';
import {
	defineProps,
	inject,
	onMounted,
	onUnmounted,
	ref,
	watchEffect,
} from 'vue';
import {MODEL_KEY} from './context';

const props = withDefaults(
	defineProps<{
		model?: DialogModel;
	}>(),
	{},
);

const resolvedModel = props.model ?? inject(MODEL_KEY);
if (resolvedModel === undefined) {
	throw new Error(
		'<Dialog.Close/> must have a `model` prop or be a child of `<Dialog.Root/>`',
	);
}
const id = resolvedModel.init('close');

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
		v-bind="{
			...resolvedModel.componentAttributes(id),
			...$attrs,
		}"
		@click="() => resolvedModel.close()"
	>
		<slot />
	</button>
</template>
