<script setup lang="ts">
import {DialogRootModel} from '@ally-ui/core-dialog';
import {useSyncedOption} from '@ally-ui/vue';
import {computed, provide, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

/**
 * @type {import('@ally-ui/core-dialog').DialogRootModelOptions}
 * @type {import('@ally-ui/core-dialog').DialogRootModelReactive}
 */
export type DialogRootProps = {
	initialOpen?: boolean;
	modal?: boolean;
	clickOutsideDeactivates?: boolean | ((ev: MouseEvent) => boolean);
	escapeDeactivates?: boolean | ((ev: KeyboardEvent) => boolean);
	returnFocusTo?: HTMLElement | (() => HTMLElement | undefined);
	open?: boolean;
};
const props = withDefaults(defineProps<DialogRootProps>(), {
	initialOpen: undefined,
	modal: undefined,
	clickOutsideDeactivates: undefined,
	escapeDeactivates: undefined,
	returnFocusTo: undefined,
	open: undefined,
});
const emit = defineEmits<{
	(ev: 'update:open', open: boolean): void;
}>();

// TODO #19 Generate SSR-safe IDs.
const id = '0';
const rootModel = new DialogRootModel(id, {
	initialOpen: props.initialOpen,
	modal: props.modal,
	clickOutsideDeactivates: props.clickOutsideDeactivates,
	escapeDeactivates: props.escapeDeactivates,
	returnFocusTo: props.returnFocusTo,
});
const rootState = ref(rootModel.initialState);
rootModel.requestStateUpdate = (updater) => {
	if (updater instanceof Function) {
		rootState.value = updater(rootState.value);
	} else {
		rootState.value = updater;
	}
};
useSyncedOption({
	option: computed(() => props.open),
	onOptionChange: (open) => (rootState.value = {...rootState.value, open}),
	internal: computed(() => rootState.value.open),
	onInternalChange: (open) => emit('update:open', open),
});
useSyncedOption({
	option: computed(() => props.modal),
	onOptionChange: (modal) => (rootState.value = {...rootState.value, modal}),
});
useSyncedOption({
	option: computed(() => props.clickOutsideDeactivates),
	onOptionChange: (clickOutsideDeactivates) =>
		(rootState.value = {...rootState.value, clickOutsideDeactivates}),
});
useSyncedOption({
	option: computed(() => props.escapeDeactivates),
	onOptionChange: (escapeDeactivates) =>
		(rootState.value = {...rootState.value, escapeDeactivates}),
});
useSyncedOption({
	option: computed(() => props.returnFocusTo),
	onOptionChange: (returnFocusTo) =>
		(rootState.value = {...rootState.value, returnFocusTo}),
});
watchEffect(function onStateUpdate() {
	rootModel.setState(rootState.value);
});

provide(DIALOG_ROOT_MODEL, rootModel);
provide(DIALOG_ROOT_STATE, rootState);
</script>

<template>
	<slot />
</template>
