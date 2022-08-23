<script setup lang="ts">
import {ref} from 'vue';
import {
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogRoot,
	DialogTitle,
	DialogTrigger,
} from '../lib/main';

const open = ref(true);
</script>

<template>
	<main>
		<h1>Ally UI Vue Dialog</h1>
		<DialogRoot v-model:open="open">
			<div>
				<button @click="() => (open = !open)">Manual toggle</button>
				<DialogTrigger>Edit profile</DialogTrigger>
				<span v-if="open">Editing profile...</span>
			</div>
			<DialogContent>
				<DialogTitle>Edit profile</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're done
				</DialogDescription>
				<fieldset>
					<label htmlFor="name">Name</label>
					<input id="name" placeholder="Bryan Lee" />
				</fieldset>
				<fieldset>
					<label htmlFor="username">Username</label>
					<input id="username" placeholder="@bryanmylee" />
				</fieldset>
				<DialogClose>Save changes</DialogClose>
				<DialogClose>x</DialogClose>
			</DialogContent>
		</DialogRoot>
	</main>
</template>
