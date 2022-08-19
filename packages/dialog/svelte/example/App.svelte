<script lang="ts">
	import {writable} from 'svelte/store';
	import {createDialog, Dialog} from '../lib/main';

	const open = writable(false);
	const dialog = createDialog({open});
</script>

<main>
	<h1>Ally UI Svelte Dialog</h1>
	<Dialog.Root model={dialog}>
		<div>
			<button on:click={() => ($open = !$open)}> Manual toggle </button>
			<Dialog.Trigger>Edit profile</Dialog.Trigger>
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
