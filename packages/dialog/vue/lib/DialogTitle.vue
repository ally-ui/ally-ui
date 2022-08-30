<script setup lang="ts">
import {DialogTitleModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogTitleModel(rootModel, {}),
);
const id = component.getId();

onMounted(() => rootModel.mountComponent(id));
onUnmounted(() => rootModel.unmountComponent(id));

const node = ref<HTMLElement | null>(null);
watchEffect(() => {
	if (node.value === null) {
		rootModel.unbindComponent(id);
	} else {
		rootModel.bindComponent(id, node.value);
	}
});
</script>

<template>
	<h1 ref="node" v-bind="{...component.getAttributes(), ...$attrs}">
		<slot />
	</h1>
</template>
