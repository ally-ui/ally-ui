<script setup lang="ts">
import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

export type DialogTriggerProps = {
	setRef?: (node: HTMLButtonElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogTriggerProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogTriggerModel(rootModel, {}),
);
const id = component.getId();

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state);

onMounted(() => rootModel.mountComponent(id));
onUnmounted(() => {
	rootModel.unmountComponent(id);
	rootModel.deregisterComponent(id);
});

const node = ref<HTMLButtonElement | null>(null);
const setRef = (nodeValue: HTMLButtonElement | null) => {
	node.value = nodeValue;
};
watchEffect(() => {
	props.setRef?.(node.value);
	if (node.value === null) {
		rootModel.unbindComponent(id);
	} else {
		rootModel.bindComponent(id, node.value);
	}
});

function handleClick() {
	component.onClick();
}
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{
			...component.getAttributes(rootState),
			onClick: handleClick,
			...$attrs,
			ref: setRef,
		}"
	/>
	<button
		v-else
		ref="node"
		v-bind="{...component.getAttributes(rootState), ...$attrs}"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
