<script setup lang="ts">
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTrigger,
} from '../../main';
</script>

<template>
	<DialogRoot initialOpen>
		<DialogTrigger data-testid="trigger">open dialog</DialogTrigger>
		<DialogContent data-testid="content">
			<DialogDescription data-testid="description">
				description
			</DialogDescription>
			<DialogClose data-testid="close">close dialog</DialogClose>
		</DialogContent>
	</DialogRoot>
</template>
