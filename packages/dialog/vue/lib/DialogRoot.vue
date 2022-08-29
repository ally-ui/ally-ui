<script setup lang="ts">
import {DialogModel} from '@ally-ui/core-dialog';
import {useSyncedOption} from '@ally-ui/vue';
import {provide, ref, watchEffect} from 'vue';
import {MODEL_KEY, STATE_KEY} from './context';

const props = withDefaults(
	defineProps<{
		open?: boolean;
		initialOpen?: boolean;
	}>(),
	{
		open: undefined,
		initialOpen: undefined,
	},
);
const emit = defineEmits<{
	(ev: 'update:open', open: boolean): void;
}>();
// TODO #20 Extract this synchronization behavior.
const openRef = ref<boolean | undefined>(props.open);
watchEffect(function emitOpen() {
	if (openRef.value !== undefined) {
		emit('update:open', openRef.value);
	}
});
watchEffect(function updateOpenRef() {
	openRef.value = props.open;
});

// TODO #19 Generate SSR-safe IDs.
const id = '0';
const model = new DialogModel(id, {initialOpen: props.initialOpen});
const state = ref(model.initialState);
model.setOptions((prevOptions) => ({
	...prevOptions,
	requestStateUpdate: (updater) => {
		if (updater instanceof Function) {
			state.value = updater(state.value);
		} else {
			state.value = updater;
		}
	},
}));

// TODO #20 Improve the interface for option synchronization.
const updateOpenOption = useSyncedOption<boolean>(openRef, (open) => {
	state.value = {...state.value, open};
});

watchEffect(function onStateUpdate() {
	model.setState(state.value);
	updateOpenOption(state.value.open);
});

provide(MODEL_KEY, model);
provide(STATE_KEY, state);
</script>

<template>
	<slot />
</template>
