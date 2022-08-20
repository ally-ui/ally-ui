<script setup lang="ts">
import DialogClose from '../lib/DialogClose.vue';
import DialogContent from '../lib/DialogContent.vue';
import DialogDescription from '../lib/DialogDescription.vue';
import DialogRoot from '../lib/DialogRoot.vue';
import DialogTitle from '../lib/DialogTitle.vue';
import DialogTrigger from '../lib/DialogTrigger.vue';
</script>

<template>
	<h1>Ally UI Vue Dialog</h1>
	<DialogRoot>
		<div>
			<button>Manual toggle</button>
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
</template>
