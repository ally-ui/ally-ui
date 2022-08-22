<script setup lang="ts">
import {ref} from 'vue';
import DialogClose from '../lib/DialogClose.vue';
import DialogContent from '../lib/DialogContent.vue';
import DialogDescription from '../lib/DialogDescription.vue';
import DialogRoot from '../lib/DialogRoot.vue';
import DialogTitle from '../lib/DialogTitle.vue';
import DialogTrigger from '../lib/DialogTrigger.vue';

const open = ref(false);
</script>

<template>
	<main>
		<h1>Ally UI Vue Dialog</h1>
		<DialogRoot :open="open">
			<div>
				<button @click="() => (open = !open)">Manual toggle</button>
				<DialogTrigger>Edit profile</DialogTrigger>
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
