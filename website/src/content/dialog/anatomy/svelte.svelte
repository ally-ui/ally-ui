<script lang="ts">
	import * as Dialog from '@ally-ui/svelte-dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger />
	<Dialog.Portal>
		<Dialog.Content>
			<Dialog.Title />
			<Dialog.Description />
			<Dialog.Close />
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
