/** @jsxImportSource solid-js */
import * as Dialog from '@ally-ui/solid-dialog';

export default function App() {
	return (
		<Dialog.Root>
			<Dialog.Trigger class="primary">Send feedback</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Title>Feedback form</Dialog.Title>
				<Dialog.Description>
					We would love to hear your thoughts
				</Dialog.Description>
				<label for="feedback">Describe your feedback</label>
				<textarea id="feedback" />
				<label for="name">Name</label>
				<input type="text" id="name" />
				<label for="email">E-mail</label>
				<input type="text" id="email" />
				<Dialog.Close>Send</Dialog.Close>
				<Dialog.Close>Close</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}
