/** @jsxImportSource react */
import * as Dialog from '@ally-ui/react-dialog';

export default function App() {
	return (
		<Dialog.Root>
			<Dialog.Trigger className="px-4 py-2 font-medium text-blue-400 bg-white reset rounded-xl hover:bg-white/80 focus:ring-2 ring-black">
				Send feedback
			</Dialog.Trigger>
			<Dialog.Portal>
				<div className="fixed inset-0 flex cursor-default reset flex-center bg-shade/50 backdrop-blur-sm">
					<Dialog.Content className="w-[65ch] max-w-lg p-8 mx-8 bg-white rounded-xl relative flex flex-col">
						<Dialog.Title className="mb-2 text-lg font-semibold">
							Feedback form
						</Dialog.Title>
						<Dialog.Description className="mb-8 text-sm text-gray-400">
							We would love to hear your thoughts
						</Dialog.Description>
						<fieldset className="flex items-center justify-end gap-6 mb-2">
							<label htmlFor="name" className="text-sm text-blue-700">
								Name
							</label>
							<input
								type="text"
								id="name"
								placeholder="Bryan Lee"
								className="w-3/4 p-2 text-sm border border-blue-400 rounded-lg placeholder:text-gray-400 focus:ring-2 ring-black"
							/>
						</fieldset>
						<fieldset className="flex items-start justify-end gap-6 mb-8">
							<label htmlFor="feedback" className="mt-2 text-sm text-blue-700">
								Feedback
							</label>
							<textarea
								id="feedback"
								placeholder="Enter your feedback..."
								className="w-3/4 p-2 text-sm border border-blue-400 rounded-lg placeholder:text-gray-400 focus:ring-2 ring-black"
							/>
						</fieldset>
						<Dialog.Close className="self-end px-4 py-2 font-medium text-blue-700 rounded-lg bg-blue-400/25">
							Send
						</Dialog.Close>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
