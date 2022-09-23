<script setup lang="ts">
import * as Dialog from '@ally-ui/vue-dialog';
</script>

<template>
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
</template>
