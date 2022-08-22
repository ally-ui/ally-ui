<script setup lang="ts">
import {provide, type Ref} from 'vue';
import {MODEL_KEY, STATE_KEY} from './context';
import {useDialog} from './main';

const props = withDefaults(
	defineProps<{
		open?: Ref<boolean>;
		initialOpen?: boolean;
	}>(),
	{},
);

const emit = defineEmits<{
	(ev: 'open-change', value: boolean): void;
}>();

const [model, state] = useDialog(props);
provide(MODEL_KEY, model);
provide(STATE_KEY, state);
</script>

<template>
	<slot />
</template>
