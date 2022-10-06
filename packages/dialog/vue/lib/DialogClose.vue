<script setup lang="ts">
import {DialogCloseModel} from '@ally-ui/core-dialog';
import {mergeVueProps, useNodeComponentModel} from '@ally-ui/vue';
import {inject, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogCloseProps = {
	setRef?: (node: HTMLButtonElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogCloseProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel == null) {
	throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
}
const component = new DialogCloseModel({}, undefined, rootModel);
const node = ref<HTMLButtonElement | null>(null);
watchEffect(() => props.setRef?.(node.value));
const setRef = (nodeValue: HTMLButtonElement | null) =>
	(node.value = nodeValue);
useNodeComponentModel(component, node);

function handleClick() {
	component.onClick();
}
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{
			...mergeVueProps(component.attributes(), $attrs),
			onClick: handleClick,
			ref: setRef,
		}"
	/>
	<button
		v-else
		ref="node"
		v-bind="mergeVueProps(component.attributes(), $attrs)"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
