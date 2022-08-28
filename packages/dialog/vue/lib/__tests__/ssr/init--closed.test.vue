<script setup lang="ts">
import Dialog from '../../main';
</script>

<template>
	<Dialog.Root>
		<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
		<Dialog.Content data-testid="content">
			<Dialog.Title data-testid="title">title</Dialog.Title>
			<Dialog.Description data-testid="description">
				description
			</Dialog.Description>
			<Dialog.Close data-testid="close">close dialog</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
</template>
