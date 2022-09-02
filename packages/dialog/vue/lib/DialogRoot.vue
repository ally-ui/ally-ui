<script setup lang="ts">
import {DialogRootModel} from '@ally-ui/core-dialog';
import {useSyncedOption} from '@ally-ui/vue';
import {computed, provide, ref, watchEffect} from 'vue';
import {DIALOG_ROOT_MODEL, DIALOG_ROOT_STATE} from './context';

export type DialogRootProps = {
	open?: boolean;
	initialOpen?: boolean;
	modal?: boolean;
};
const props = withDefaults(defineProps<DialogRootProps>(), {
	open: undefined,
	initialOpen: undefined,
	modal: undefined,
});
const emit = defineEmits<{
	(ev: 'update:open', open: boolean): void;
}>();

// TODO #19 Generate SSR-safe IDs.
const id = '0';
const rootModel = new DialogRootModel(id, {
	initialOpen: props.initialOpen,
	modal: props.modal,
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
watchEffect(function onStateUpdate() {
	rootModel.setState(rootState.value);
});

provide(DIALOG_ROOT_MODEL, rootModel);
provide(DIALOG_ROOT_STATE, rootState);
</script>

<template>
	<slot />
</template>
