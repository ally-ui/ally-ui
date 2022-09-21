<script lang="ts">
	import * as Dialog from '../lib/main';

	let modal = false;
</script>

<button on:click={() => (modal = !modal)} data-testid="toggle-modal">
	modal
</button>
<Dialog.Root {modal}>
	<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
	<Dialog.Content data-testid="content" forceMount>
		<Dialog.Title data-testid="title">title</Dialog.Title>
		<Dialog.Description data-testid="description">
			description
		</Dialog.Description>
		<Dialog.Close data-testid="close">close dialog</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
