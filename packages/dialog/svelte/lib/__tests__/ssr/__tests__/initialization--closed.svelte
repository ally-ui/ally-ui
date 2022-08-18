<script lang="ts">
	import {createDialog, Dialog} from '../../../main';
	const dialog = createDialog();
</script>

<Dialog.Trigger model={dialog}>open dialog</Dialog.Trigger>
<Dialog.Content model={dialog}>
	<Dialog.Title model={dialog}>title</Dialog.Title>
	<Dialog.Description model={dialog}>description</Dialog.Description>
	<Dialog.Close model={dialog}>close dialog</Dialog.Close>
</Dialog.Content>
