<script setup lang="ts">
import {provide, ref, watchEffect} from 'vue';
import {MODEL_KEY, STATE_KEY} from './context';
import {useDialog} from './main';

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

const openRef = ref<boolean | undefined>(props.open);
watchEffect(function emitOpen() {
	if (openRef.value !== undefined) {
		emit('update:open', openRef.value);
	}
});
watchEffect(function updateOpenRef() {
	openRef.value = props.open;
});

const [model, state] = useDialog({
	openRef,
	initialOpen: props.initialOpen,
});

provide(MODEL_KEY, model);
provide(STATE_KEY, state);
</script>

<template>
	<slot />
</template>
