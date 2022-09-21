<script setup lang="ts">
import {ref} from 'vue';
import * as Dialog from '../lib/main';

const modal = ref(false);
</script>

<template>
	<button @click="() => (modal = !modal)" data-testid="toggle-modal">
		modal
	</button>
	<Dialog.Root :modal="modal">
		<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
		<Dialog.Content data-testid="content" force-mount>
			<Dialog.Title data-testid="title">title</Dialog.Title>
			<Dialog.Description data-testid="description">
				description
			</Dialog.Description>
			<Dialog.Close data-testid="close">close dialog</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
</template>
