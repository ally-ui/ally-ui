<script lang="ts">
	import * as Dialog from '@ally-ui/svelte-dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="reset rounded-xl bg-white px-4 py-2 font-medium text-blue-400 hover:opacity-80 focus:ring-black"
	>
		Send feedback
	</Dialog.Trigger>
	<Dialog.Portal>
		<div
			class="reset flex-center bg-shade/50 fixed inset-0 flex cursor-default backdrop-blur-sm"
		>
			<Dialog.Content
				class="relative mx-8 flex w-[65ch] max-w-lg flex-col rounded-xl bg-white p-8"
			>
				<Dialog.Title class="mb-2 text-lg font-semibold text-black">
					Feedback form
				</Dialog.Title>
				<Dialog.Description class="mb-8 text-sm text-gray-400">
					We would love to hear your thoughts
				</Dialog.Description>
				<fieldset class="mb-2 flex items-center justify-end gap-6">
					<label for="name" class="text-sm text-blue-700"> Name </label>
					<input
						type="text"
						id="name"
						placeholder="Bryan Lee"
						class="w-3/4 rounded-lg border border-blue-400 p-2 text-sm text-black placeholder:text-gray-400"
					/>
				</fieldset>
				<fieldset class="mb-8 flex items-start justify-end gap-6">
					<label for="feedback" class="mt-2 text-sm text-blue-700">
						Feedback
					</label>
					<textarea
						id="feedback"
						placeholder="Enter your feedback..."
						class="w-3/4 rounded-lg border border-blue-400 p-2 text-sm text-black placeholder:text-gray-400"
					/>
				</fieldset>
				<Dialog.Close
					class="self-end rounded-xl bg-blue-400/25 px-4 py-2 font-medium text-blue-700 hover:opacity-80"
				>
					Send feedback
				</Dialog.Close>
			</Dialog.Content>
		</div>
	</Dialog.Portal>
</Dialog.Root>
