<script lang="ts">
	import Dialog from '../../main';
</script>

<Dialog.Root initialOpen>
	<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
	<Dialog.Content data-testid="content">
		<Dialog.Description data-testid="description">
			description
		</Dialog.Description>
		<Dialog.Close data-testid="close">close dialog</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
