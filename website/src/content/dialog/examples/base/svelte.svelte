<script lang="ts">
	import * as Dialog from '@ally-ui/svelte-dialog';
</script>

<Dialog.Root>
	<Dialog.Trigger
		class="px-4 py-2 font-medium text-blue-400 bg-white reset rounded-xl hover:opacity-80 focus:ring-black"
	>
		Send feedback
	</Dialog.Trigger>
	<Dialog.Portal>
		<div
			class="fixed inset-0 flex cursor-default reset flex-center bg-shade/50 backdrop-blur-sm"
		>
			<Dialog.Content
				class="w-[65ch] max-w-lg p-8 mx-8 bg-white rounded-xl relative flex flex-col"
			>
				<Dialog.Title class="mb-2 text-lg font-semibold text-black">
					Feedback form
				</Dialog.Title>
				<Dialog.Description class="mb-8 text-sm text-gray-400">
					We would love to hear your thoughts
				</Dialog.Description>
				<fieldset class="flex items-center justify-end gap-6 mb-2">
					<label for="name" class="text-sm text-blue-700"> Name </label>
					<input
						type="text"
						id="name"
						placeholder="Bryan Lee"
						class="w-3/4 p-2 text-sm border border-blue-400 rounded-lg placeholder:text-gray-400"
					/>
				</fieldset>
				<fieldset class="flex items-start justify-end gap-6 mb-8">
					<label for="feedback" class="mt-2 text-sm text-blue-700">
						Feedback
					</label>
					<textarea
						id="feedback"
						placeholder="Enter your feedback..."
						class="w-3/4 p-2 text-sm border border-blue-400 rounded-lg placeholder:text-gray-400"
					/>
				</fieldset>
				<Dialog.Close
					class="self-end px-4 py-2 font-medium text-blue-700 rounded-xl bg-blue-400/25 hover:opacity-80"
				>
					Send feedback
				</Dialog.Close>
			</Dialog.Content>
		</div>
	</Dialog.Portal>
</Dialog.Root>
