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
import {MODEL_KEY, STATE_KEY} from './context';

const props = withDefaults(
	defineProps<{
		model?: DialogModel;
	}>(),
	{},
);

const resolvedModel = props.model ?? inject(MODEL_KEY);
if (resolvedModel === undefined) {
	throw new Error(
		'<Dialog.Content/> must have a `model` prop or be a child of `<Dialog.Root/>`',
	);
}
const id = resolvedModel.init('content');

const state = inject(STATE_KEY) ?? ref(resolvedModel.getState());

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
	<div
		v-if="state.open"
		ref="node"
		v-bind="{
			...resolvedModel.componentAttributes(id, state),
			...$attrs,
		}"
	>
		<slot />
	</div>
</template>
