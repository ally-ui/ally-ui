<script setup lang="ts">
import {provide} from 'vue';
import {MODEL_KEY, STATE_KEY} from './context';
import {useDialog} from './main';

const [model, state] = useDialog();
provide(MODEL_KEY, model);
provide(STATE_KEY, state);
</script>

<template>
	<slot />
</template>
