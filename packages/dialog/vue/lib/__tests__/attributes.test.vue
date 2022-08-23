<script setup lang="ts">
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from '../main';

const props = withDefaults(
	defineProps<{
		initialOpen?: boolean;
	}>(),
	{
		initialOpen: false,
	},
);
</script>

<template>
	<DialogRoot :initialOpen="props.initialOpen">
		<DialogTrigger data-testid="trigger">open dialog</DialogTrigger>
		<DialogContent data-testid="content">
			<DialogTitle data-testid="title">title</DialogTitle>
			<DialogDescription data-testid="description">
				description
			</DialogDescription>
			<DialogClose data-testid="close">close dialog</DialogClose>
		</DialogContent>
	</DialogRoot>
</template>
