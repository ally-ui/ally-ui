<script setup lang="ts">
import {provide} from 'vue';
import {modelKey, stateKey} from './context';
import {useDialog} from './main';

const [model, state] = useDialog();
provide(modelKey, model);
provide(stateKey, state);
</script>

<template>
	<slot />
</template>
