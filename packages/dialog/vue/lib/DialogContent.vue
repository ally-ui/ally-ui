<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {MODEL_KEY, STATE_KEY} from './context';

const model = inject(MODEL_KEY);
if (model === undefined) {
	throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
}
const id = model.init('content');

const state = inject(STATE_KEY) ?? ref(model.getState());

onMounted(() => model.mount(id));
onUnmounted(() => model.unmount(id));

const node = ref<HTMLElement | null>(null);
watchEffect(() => {
	if (node.value === null) {
		model.unbindNode(id);
	} else {
		model.bindNode(id, node.value);
	}
});
</script>

<template>
	<div
		v-if="state.open"
		ref="node"
		v-bind="{
			...model.componentAttributes(id, state),
			...$attrs,
		}"
	>
		<slot />
	</div>
</template>
