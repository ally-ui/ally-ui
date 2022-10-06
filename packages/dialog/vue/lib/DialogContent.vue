<script setup lang="ts">
import {DialogContentModel} from '@ally-ui/core-dialog';
import {computed, inject, ref, watchEffect} from 'vue';
import {
	DIALOG_PORTAL_FORCE_MOUNT,
	DIALOG_ROOT_MODEL,
	DIALOG_ROOT_STATE,
} from './context';
import {useNodeComponentModel, mergeVueProps} from '@ally-ui/vue';

/**
 * @type {import('@ally-ui/core-dialog').DialogContentModelProps}
 */
export type DialogContentProps = {
	setRef?: (node: HTMLDivElement | null) => void;
	asChild?: true | undefined;
	forceMount?: boolean | undefined;
	allowPinchZoom?: boolean | undefined;
};
/**
 * @type {import('@ally-ui/core-dialog').DialogContentModelEvents}
 */
export type DialogContentEvents = {
	(type: 'openAutoFocus', ev: Event): void;
	(type: 'closeAutoFocus', ev: Event): void;
	(type: 'escapeKeyDown', ev: KeyboardEvent): void;
	(type: 'interactOutside', ev: MouseEvent | TouchEvent): void;
};
const props = withDefaults(defineProps<DialogContentProps>(), {
	asChild: undefined,
	forceMount: undefined,
	allowPinchZoom: undefined,
});
const emit = defineEmits<DialogContentEvents>();

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel == null) {
	throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
}
const portalForceMount = inject(DIALOG_PORTAL_FORCE_MOUNT);
const component = new DialogContentModel(
	{
		forceMount: props.forceMount ?? portalForceMount,
		allowPinchZoom: props.allowPinchZoom,
	},
	{
		openAutoFocus: (ev) => emit('openAutoFocus', ev),
		closeAutoFocus: (ev) => emit('closeAutoFocus', ev),
		escapeKeyDown: (ev) => emit('escapeKeyDown', ev),
		interactOutside: (ev) => emit('interactOutside', ev),
	},
	rootModel,
);
const node = ref<HTMLDivElement | null>(null);
watchEffect(() => props.setRef?.(node.value));
const setRef = (nodeValue: HTMLDivElement | null) => (node.value = nodeValue);
const state = useNodeComponentModel(component, node);

// Note that we do not need to sync options for event handlers because Vue does
// not use handlers but emits events instead.

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state.value);
const derivedState = computed(() =>
	component.derived(state.value, rootState.value),
);
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
