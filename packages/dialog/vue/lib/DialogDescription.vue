<script setup lang="ts">
import {DialogDescriptionModel} from '@ally-ui/core-dialog';
import {mergeVueProps} from '@ally-ui/vue';
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
if (rootModel == null) {
	throw new Error('<Dialog.Description/> must be a child of `<Dialog.Root/>`');
}
const component = new DialogDescriptionModel({}, undefined, rootModel);

onMounted(() => component.mount());
onUnmounted(() => {
	component.unmount();
	component.unregister();
});

const node = ref<HTMLParagraphElement | null>(null);
const setRef = (nodeValue: HTMLParagraphElement | null) => {
	node.value = nodeValue;
};
watchEffect(() => {
	props.setRef?.(node.value);
	if (node.value == null) {
		component.unbind();
	} else {
		component.bind(node.value);
	}
});
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
