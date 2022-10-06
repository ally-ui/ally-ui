<script setup lang="ts">
import {DialogDescriptionModel} from '@ally-ui/core-dialog';
import {mergeVueProps, useNodeComponentModel} from '@ally-ui/vue';
import {inject, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogDescriptionProps = {
	setRef?: (node: HTMLParagraphElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogDescriptionProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel == null) {
	throw new Error('<Dialog.Description/> must be a child of `<Dialog.Root/>`');
}
const component = new DialogDescriptionModel({}, undefined, rootModel);
const node = ref<HTMLParagraphElement | null>(null);
watchEffect(() => props.setRef?.(node.value));
const setRef = (nodeValue: HTMLParagraphElement | null) =>
	(node.value = nodeValue);
useNodeComponentModel(component, node);
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{...mergeVueProps(component.attributes(), $attrs), ref: setRef}"
	/>
	<p v-else ref="node" v-bind="mergeVueProps(component.attributes(), $attrs)">
		<slot />
	</p>
</template>
