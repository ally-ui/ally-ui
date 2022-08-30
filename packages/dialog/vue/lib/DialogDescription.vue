<script setup lang="ts">
import {DialogDescriptionModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Description/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogDescriptionModel(rootModel, {}),
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
	<p ref="node" v-bind="{...component.getAttributes(), ...$attrs}">
		<slot />
	</p>
</template>
