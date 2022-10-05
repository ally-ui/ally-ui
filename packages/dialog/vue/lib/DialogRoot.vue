<script setup lang="ts">
import {DialogRootModel} from '@ally-ui/core-dialog';
import {useSyncedOption} from '@ally-ui/vue';
import {computed, provide, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

/**
 * @type {import('@ally-ui/core-dialog').DialogRootModelProps}
 */
export type DialogRootProps = {
	initialOpen?: boolean;
	open?: boolean;
	modal?: boolean;
};
/**
 * @type {import('@ally-ui/core-dialog').DialogRootModelEvents}
 */
export type DialogRootEvents = {
	(type: 'update:open', open: boolean): void;
};
const props = withDefaults(defineProps<DialogRootProps>(), {
	initialOpen: undefined,
	modal: undefined,
	open: undefined,
});
const emit = defineEmits<DialogRootEvents>();

// TODO #19 Generate SSR-safe IDs.
const id = '0';
const rootModel = new DialogRootModel(
	id,
	{
		initialOpen: props.initialOpen,
		open: props.open,
		modal: props.modal,
	},
	{
		openChange: (open) => emit('update:open', open),
	},
);
const rootState = ref(rootModel.state.initialValue);
rootModel.state.requestUpdate = (updater) => {
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
watchEffect(function onStateUpdate() {
	rootModel.state.setValue(rootState.value);
});

provide(DIALOG_ROOT_MODEL, rootModel);
provide(DIALOG_ROOT_STATE, rootState);
</script>

<template>
	<slot />
</template>
