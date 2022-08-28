<script setup lang="ts">
import {ref} from 'vue';
import Dialog from '../lib/main';

const open = ref(true);
</script>

<template>
	<main>
		<h1>Ally UI Vue Dialog</h1>
		<Dialog.Root v-model:open="open">
			<div>
				<button @click="() => (open = !open)">Manual toggle</button>
				<Dialog.Trigger>Edit profile</Dialog.Trigger>
				<span v-if="open">Editing profile...</span>
			</div>
			<Dialog.Content>
				<Dialog.Title>Edit profile</Dialog.Title>
				<Dialog.Description>
					Make changes to your profile here. Click save when you're done
				</Dialog.Description>
				<fieldset>
					<label for="name">Name</label>
					<input id="name" placeholder="Bryan Lee" />
				</fieldset>
				<fieldset>
					<label for="username">Username</label>
					<input id="username" placeholder="@bryanmylee" />
				</fieldset>
				<Dialog.Close>Save changes</Dialog.Close>
				<Dialog.Close>x</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	</main>
</template>
