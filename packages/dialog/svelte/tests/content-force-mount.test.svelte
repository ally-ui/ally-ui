<script lang="ts">
	import Dialog from '../lib/main';
</script>

<Dialog.Root>
	<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
	<Dialog.Content data-testid="content" forceMount>
		<Dialog.Title data-testid="title">title</Dialog.Title>
		<Dialog.Description data-testid="description">
			description
		</Dialog.Description>
		<Dialog.Close data-testid="close">close dialog</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
