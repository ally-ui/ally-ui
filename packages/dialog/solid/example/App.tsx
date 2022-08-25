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
			</Dialog.Root>
		</main>
	);
}
