/** @jsxImportSource react */
import * as Dialog from '@ally-ui/react-dialog';

export default function App() {
	return (
		<Dialog.Root>
			<Dialog.Trigger className="reset rounded-xl bg-white px-4 py-2 font-medium text-blue-400 hover:opacity-80 focus:ring-black">
				Send feedback
			</Dialog.Trigger>
			<Dialog.Portal>
				<div className="reset flex-center fixed inset-0 z-10 flex cursor-default bg-gray-800/50 backdrop-blur-sm">
					<Dialog.Content className="relative mx-8 flex w-[65ch] max-w-lg flex-col rounded-xl bg-white p-8">
						<Dialog.Title className="mb-2 text-lg font-semibold text-black">
							Feedback form
						</Dialog.Title>
						<Dialog.Description className="mb-8 text-sm text-gray-400">
							We would love to hear your thoughts
						</Dialog.Description>
						<form className="mb-8 grid grid-cols-[1fr_3fr] justify-end gap-4">
							<label
								htmlFor="name"
								className="p-2 text-right text-sm text-blue-700"
							>
								Name
							</label>
							<input
								type="text"
								id="name"
								placeholder="Bryan Lee"
								className="rounded-lg border border-blue-400 p-2 text-sm text-black placeholder:text-gray-400"
							/>
							<label
								htmlFor="feedback"
								className="p-2 text-right text-sm text-blue-700"
							>
								Feedback
							</label>
							<textarea
								id="feedback"
								placeholder="Enter your feedback..."
								className="rounded-lg border border-blue-400 p-2 text-sm text-black placeholder:text-gray-400"
							/>
						</form>
						<Dialog.Close className="self-end rounded-xl bg-blue-400/25 px-4 py-2 font-medium text-blue-700 hover:opacity-80">
							Send feedback
						</Dialog.Close>
						<Dialog.Close className="absolute right-8 top-8">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="icon icon-tabler icon-tabler-x"
								width="24"
								height="24"
								viewBox="0 0 24 24"
								strokeWidth="1.5"
								stroke="black"
								fill="none"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path stroke="none" d="M0 0h24v24H0z" fill="none" />
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</Dialog.Close>
					</Dialog.Content>
				</div>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
