<script lang="ts">
	import {createDialog, Dialog} from '../../main';

	export let initialOpen: boolean;
	const dialog = createDialog({initialOpen});
</script>

<Dialog.Root model={dialog}>
	<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
	<Dialog.Content data-testid="content">
		<Dialog.Title data-testid="title">title</Dialog.Title>
		<Dialog.Description data-testid="description">
			description
		</Dialog.Description>
		<Dialog.Close data-testid="close">close dialog</Dialog.Close>
	</Dialog.Content>
</Dialog.Root>
