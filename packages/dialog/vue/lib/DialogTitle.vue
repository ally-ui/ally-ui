<script setup lang="ts">
import {DialogTitleModel} from '@ally-ui/core-dialog';
import {mergeVueProps, useNodeComponentModel} from '@ally-ui/vue';
import {inject, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogTitleProps = {
	setRef?: (node: HTMLHeadingElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogTitleProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel == null) {
	throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
}
const component = new DialogTitleModel({}, undefined, rootModel);
const node = ref<HTMLHeadingElement | null>(null);
watchEffect(() => props.setRef?.(node.value));
const setRef = (nodeValue: HTMLHeadingElement | null) =>
	(node.value = nodeValue);
useNodeComponentModel(component, node);
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{...mergeVueProps(component.attributes(), $attrs), ref: setRef}"
	/>
	<h1 v-else ref="node" v-bind="mergeVueProps(component.attributes(), $attrs)">
		<slot />
	</h1>
</template>
