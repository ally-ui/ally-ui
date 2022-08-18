<script lang="ts">
	import {readable} from 'svelte/store';
	import {createDialog, Dialog} from '../../../main';

	const open = readable(true);
	const dialog = createDialog({open});
</script>

<Dialog.Trigger model={dialog}>open dialog</Dialog.Trigger>
<Dialog.Content model={dialog}>
	<Dialog.Title model={dialog}>title</Dialog.Title>
	<Dialog.Description model={dialog}>description</Dialog.Description>
	<Dialog.Close model={dialog}>close dialog</Dialog.Close>
</Dialog.Content>
