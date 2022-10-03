<script setup lang="ts">
import {DialogCloseModel} from '@ally-ui/core-dialog';
import {mergeVueProps} from '@ally-ui/vue';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogCloseProps = {
	setRef?: (node: HTMLButtonElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogCloseProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogCloseModel(rootModel, {}),
);
const id = component.getId();

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
			...mergeVueProps(component.getAttributes(), $attrs),
			onClick: handleClick,
			ref: setRef,
		}"
	/>
	<button
		v-else
		ref="node"
		v-bind="mergeVueProps(component.getAttributes(), $attrs)"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
