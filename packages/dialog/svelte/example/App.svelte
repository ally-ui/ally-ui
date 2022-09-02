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
			{#if open}
				<span>Editing profile...</span>
			{/if}
		</div>
		<Dialog.Content asChild let:props let:ref forceMount>
			<section {...props} use:ref>
				<Dialog.Title bind:node={titleNode} asChild let:props let:ref>
					<h2 {...props} use:ref>Edit profile</h2>
				</Dialog.Title>
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
				<Dialog.Close asChild let:props let:ref>
					<span {...props} use:ref>x</span>
				</Dialog.Close>
			</section>
		</Dialog.Content>
	</Dialog.Root>
</main>
