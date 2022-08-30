<script setup lang="ts">
import {DialogContentModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogContentModel(rootModel, {}),
);
const id = component.getId();

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.getState());

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
	<div
		v-if="rootState.open"
		ref="node"
		v-bind="{...component.getAttributes(rootState), ...$attrs}"
	>
		<slot />
	</div>
</template>
