<script lang="ts">
	import type {Writable} from 'svelte/store';
	import {createDialog, Dialog} from '../main';

	export let initialOpen: boolean | undefined = undefined;
	export let open: Writable<boolean> | undefined = undefined;
	const dialog = createDialog({initialOpen, open});
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
