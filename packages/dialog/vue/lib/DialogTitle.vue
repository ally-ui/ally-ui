<script setup lang="ts">
import {DialogTitleModel} from '@ally-ui/core-dialog';
import {mergeVueProps} from '@ally-ui/vue';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogTitleProps = {
	setRef?: (node: HTMLHeadingElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogTitleProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogTitleModel(rootModel, {}),
);
const id = component.getId();

onMounted(() => rootModel.mountComponent(id));
onUnmounted(() => {
	rootModel.unmountComponent(id);
	rootModel.deregisterComponent(id);
});

const node = ref<HTMLHeadingElement | null>(null);
const setRef = (nodeValue: HTMLHeadingElement | null) => {
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
</script>

<template>
	<slot
		v-if="props.asChild"
		v-bind="{...mergeVueProps(component.getAttributes(), $attrs), ref: setRef}"
	/>
	<h1
		v-else
		ref="node"
		v-bind="mergeVueProps(component.getAttributes(), $attrs)"
	>
		<slot />
	</h1>
</template>
