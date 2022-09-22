<script setup lang="ts">
import {DialogDescriptionModel} from '@ally-ui/core-dialog';
import {inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL} from './context';

export type DialogDescriptionProps = {
	setRef?: (node: HTMLParagraphElement | null) => void;
	asChild?: true | undefined;
};
const props = withDefaults(defineProps<DialogDescriptionProps>(), {
	asChild: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Description/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogDescriptionModel(rootModel, {}),
);
const id = component.getId();

onMounted(() => rootModel.mountComponent(id));
onUnmounted(() => {
	rootModel.unmountComponent(id);
	rootModel.deregisterComponent(id);
});

const node = ref<HTMLParagraphElement | null>(null);
const setRef = (nodeValue: HTMLParagraphElement | null) => {
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
		v-bind="{...component.getAttributes(), ...$attrs, ref: setRef}"
	/>
	<p v-else ref="node" v-bind="{...component.getAttributes(), ...$attrs}">
		<slot />
	</p>
</template>
