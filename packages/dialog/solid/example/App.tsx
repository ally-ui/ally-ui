import {createSignal, Show} from 'solid-js';
import {Dialog} from '../lib/main';

export default function App() {
	const [open, setOpen] = createSignal(false);

	return (
		<main>
			<h1>Ally UI Solid Dialog</h1>
			<Dialog.Root>
				<div>
					<button onClick={() => setOpen(!open())}>Manual toggle</button>
					<Dialog.Trigger>Edit profile</Dialog.Trigger>
					<Show when={open()}>
						<span>Editing profile...</span>
					</Show>
				</div>
				<Dialog.Content>
					<fieldset>
						<label for="name">Name</label>
						<input id="name" placeholder="Bryan Lee" />
					</fieldset>
					<fieldset>
						<label for="username">Username</label>
						<input id="username" placeholder="@bryanmylee" />
					</fieldset>
					<Dialog.Close>Save changes</Dialog.Close>
					<Dialog.Close>x</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</main>
	);
}
