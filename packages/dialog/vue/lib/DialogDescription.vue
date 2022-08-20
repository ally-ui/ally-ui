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
import {modelKey} from './context';

const props = withDefaults(
	defineProps<{
		model?: DialogModel;
	}>(),
	{},
);

const resolvedModel = props.model ?? inject(modelKey);
if (resolvedModel === undefined) {
	throw new Error(
		'<Dialog.Description /> must have a `model` prop or be a child of `<Dialog.Root/>`',
	);
}
const id = resolvedModel.init('description');

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
	<p ref="node" v-bind="resolvedModel.componentAttributes(id)">
		<slot />
	</p>
</template>
