<script setup lang="ts">
import {DialogContentModel} from '@ally-ui/core-dialog';
import {computed, inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

/**
 * @type {import('@ally-ui/core-dialog').DialogContentModelOptions}
 */
export type DialogContentProps = {
	setRef?: (node: HTMLDivElement | null) => void;
	asChild?: true | undefined;
	forceMount?: boolean | undefined;
};
const props = withDefaults(defineProps<DialogContentProps>(), {
	asChild: undefined,
	forceMount: undefined,
});
const emit = defineEmits<{
	(type: 'openAutoFocus', ev: Event): void;
	(type: 'closeAutoFocus', ev: Event): void;
	(type: 'escapeKeyDown', ev: KeyboardEvent): void;
	(type: 'interactOutside', ev: MouseEvent | TouchEvent): void;
}>();

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
}
const component = rootModel.registerComponent(
	new DialogContentModel(rootModel, {
		forceMount: props.forceMount,
		onOpenAutoFocus: (ev) => emit('openAutoFocus', ev),
		onCloseAutoFocus: (ev) => emit('closeAutoFocus', ev),
		onEscapeKeyDown: (ev) => emit('escapeKeyDown', ev),
		onInteractOutside: (ev) => emit('interactOutside', ev),
	}),
);
const id = component.getId();

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state);
const derivedState = computed(() => component.deriveState(rootState.value));

onMounted(() => rootModel.mountComponent(id));
onUnmounted(() => rootModel.unmountComponent(id));

const node = ref<HTMLDivElement | null>(null);
const setRef = (nodeValue: HTMLDivElement | null) => {
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
	<template v-if="derivedState.show">
		<slot
			v-if="props.asChild"
			v-bind="{...component.getAttributes(rootState), ...$attrs, ref: setRef}"
		/>
		<div
			v-else
			ref="node"
			v-bind="{...component.getAttributes(rootState), ...$attrs}"
		>
			<slot />
		</div>
	</template>
</template>
