<script setup lang="ts">
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {MODEL_KEY} from './context';

const model = inject(MODEL_KEY);
if (model === undefined) {
	throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
}
const id = model.init('title');

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
	<h1
		ref="node"
		v-bind="{
			...model.componentAttributes(id),
			...$attrs,
		}"
	>
		<slot />
	</h1>
</template>
