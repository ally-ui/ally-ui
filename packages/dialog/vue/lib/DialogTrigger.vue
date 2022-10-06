<script setup lang="ts">
import {DialogTriggerModel} from '@ally-ui/core-dialog';
import {mergeVueProps, useNodeComponentModel} from '@ally-ui/vue';
import {inject, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

export type DialogTriggerProps = {
	setRef?: (node: HTMLButtonElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogTriggerProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel == null) {
	throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
}
const component = new DialogTriggerModel({}, undefined, rootModel);
const node = ref<HTMLButtonElement | null>(null);
watchEffect(() => props.setRef?.(node.value));
const setRef = (nodeValue: HTMLButtonElement | null) =>
	(node.value = nodeValue);
useNodeComponentModel(component, node);

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state.value);

function handleClick() {
	component.onClick();
}
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{
			...mergeVueProps(component.attributes(rootState), $attrs),
			onClick: handleClick,
			ref: setRef,
		}"
	/>
	<button
		v-else
		ref="node"
		v-bind="mergeVueProps(component.attributes(rootState), $attrs)"
		@click="handleClick"
	>
		<slot />
	</button>
</template>
