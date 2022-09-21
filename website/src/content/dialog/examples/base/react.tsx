/** @jsxImportSource react */
import * as Dialog from '@ally-ui/react-dialog';

export default function App() {
	return (
		<Dialog.Root>
			<Dialog.Trigger>Send feedback</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Feedback form</Dialog.Title>
				<Dialog.Description>
					We would love to hear your thoughts
				</Dialog.Description>
				<label htmlFor="feedback">Describe your feedback</label>
				<textarea id="feedback" />
				<label htmlFor="name">Name</label>
				<input type="text" id="name" />
				<label htmlFor="email">E-mail</label>
				<input type="text" id="email" />
				<Dialog.Close>Send</Dialog.Close>
				<Dialog.Close>Close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}
