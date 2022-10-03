<script setup lang="ts">
import {DialogContentModel} from '@ally-ui/core-dialog';
import {computed, inject, onMounted, onUnmounted, ref, watchEffect} from 'vue';
import {
	DIALOG_PORTAL_FORCE_MOUNT,
	DIALOG_ROOT_MODEL,
	DIALOG_ROOT_STATE,
} from './context';
import {mergeVueProps} from '@ally-ui/vue';

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
const portalForceMount = inject(DIALOG_PORTAL_FORCE_MOUNT);
const component = new DialogContentModel(
	{
		forceMount: props.forceMount ?? portalForceMount,
		onOpenAutoFocus: (ev) => emit('openAutoFocus', ev),
		onCloseAutoFocus: (ev) => emit('closeAutoFocus', ev),
		onEscapeKeyDown: (ev) => emit('escapeKeyDown', ev),
		onInteractOutside: (ev) => emit('interactOutside', ev),
	},
	rootModel,
);

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state);
const derivedState = computed(() => component.derived(rootState.value));

onMounted(() => component.onMount());
onUnmounted(() => {
	component.onUnmount();
	component.onDeregister();
});

const node = ref<HTMLDivElement | null>(null);
const setRef = (nodeValue: HTMLDivElement | null) => {
	node.value = nodeValue;
};
watchEffect(() => {
	props.setRef?.(node.value);
	if (node.value == null) {
		component.onUnbind();
	} else {
		component.onBind(node.value);
	}
});
</script>

<template>
	<template v-if="derivedState.show">
		<slot
			v-if="props.asChild"
			v-bind="{
				...mergeVueProps(component.attributes(rootState), $attrs),
				ref: setRef,
			}"
		/>
		<div
			v-else
			ref="node"
			v-bind="mergeVueProps(component.attributes(rootState), $attrs)"
		>
			<slot />
		</div>
	</template>
</template>
