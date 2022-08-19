<script lang="ts">
	import {createDialog, Dialog} from '../main';

	export let initialOpen = false;
	const dialog = createDialog({initialOpen});
</script>

<Dialog.Trigger model={dialog} data-testid="trigger">
	open dialog
</Dialog.Trigger>
<Dialog.Content model={dialog} data-testid="content">
	<Dialog.Title model={dialog} data-testid="title">title</Dialog.Title>
	<Dialog.Description model={dialog} data-testid="description">
		description
	</Dialog.Description>
	<Dialog.Close model={dialog} data-testid="close">close dialog</Dialog.Close>
</Dialog.Content>
