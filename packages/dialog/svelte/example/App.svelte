<script lang="ts">
	import Dialog from '../lib/main';

	let open = true;
	let titleNode: HTMLHeadingElement | undefined | null;
	$: if (titleNode != null) {
		titleNode.style.color = 'gray';
	}
</script>

<main>
	<h1>Ally UI Svelte Dialog</h1>
	<Dialog.Root bind:open>
		<div>
			<button on:click={() => (open = !open)}>Manual toggle</button>
			<Dialog.Trigger>Edit profile</Dialog.Trigger>
			<Dialog.Trigger asChild let:props let:events>
				<span {...props} use:events> Edit profile </span>
			</Dialog.Trigger>
			{#if open}
				<span>Editing profile...</span>
			{/if}
		</div>
		<Dialog.Content>
			<Dialog.Title bind:node={titleNode}>Edit profile</Dialog.Title>
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
			<Dialog.Close asChild let:props let:events>
				<span {...props} use:events>Save changes</span>
			</Dialog.Close>
			<Dialog.Close>x</Dialog.Close>
		</Dialog.Content>
	</Dialog.Root>
</main>
