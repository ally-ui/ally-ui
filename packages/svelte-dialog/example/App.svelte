<script lang="ts">
	import {writable} from 'svelte/store';
	import {createDialog, Dialog} from '../lib/main';

	const open = writable(true);
	const dialog = createDialog({open});
</script>

<main>
	<h1>Ally UI Svelte Dialog</h1>
	<div>
		<button on:click={() => ($open = !$open)}> Manual toggle </button>
		<Dialog.Trigger model={dialog}>Edit profile</Dialog.Trigger>
	</div>
	<Dialog.Content model={dialog}>
		<Dialog.Title model={dialog}>Edit profile</Dialog.Title>
		<Dialog.Description model={dialog}>
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
		<Dialog.Close model={dialog}>Save changes</Dialog.Close>
		<Dialog.Close model={dialog}>x</Dialog.Close>
	</Dialog.Content>
</main>
