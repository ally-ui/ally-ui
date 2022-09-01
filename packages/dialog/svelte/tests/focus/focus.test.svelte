<script lang="ts">
	import Dialog from '../../lib/main';

	export let initialOpen: boolean | undefined = undefined;
	export let open: boolean | undefined = undefined;
</script>

<Dialog.Root {initialOpen} {open}>
	<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
	<Dialog.Content data-testid="content">
		<Dialog.Title data-testid="title">title</Dialog.Title>
		<Dialog.Description data-testid="description">
			description
		</Dialog.Description>
		<Dialog.Close data-testid="close">close dialog</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
