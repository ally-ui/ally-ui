<script setup lang="ts">
import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogTriggerModel(rootModel, {}),
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
	<button
		ref="node"
		v-bind="{
			...component.getAttributes(rootState),
			...$attrs,
		}"
		@click="() => component.onClick()"
	>
		<slot />
	</button>
</template>
