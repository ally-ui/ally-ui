<script lang="ts">
	import {Dialog} from '../lib/main';

	let open = false;
</script>

<main>
	<h1>Ally UI Svelte Dialog</h1>
	<Dialog.Root bind:open>
		<div>
			<button on:click={() => (open = !open)}> Manual toggle </button>
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
