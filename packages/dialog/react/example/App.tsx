import {useState} from 'react';
import {Dialog, useDialog} from '../lib/main';

export default function App() {
	const [open, setOpen] = useState(true);
	const dialog = useDialog({
		open,
		onOpenChange: setOpen,
	});

	return (
		<main>
			<h1>Ally UI React Dialog</h1>
			<div>
				<button onClick={() => setOpen((o) => !o)}>Manual toggle</button>
				<Dialog.Trigger model={dialog}>Edit profile</Dialog.Trigger>
			</div>
			<Dialog.Content model={dialog}>
				<Dialog.Title model={dialog}>Edit profile</Dialog.Title>
				<Dialog.Description model={dialog}>
					Make changes to your profile here. Click save when you're done
				</Dialog.Description>
				<fieldset>
					<label htmlFor="name">Name</label>
					<input id="name" placeholder="Bryan Lee" />
				</fieldset>
				<fieldset>
					<label htmlFor="username">Username</label>
					<input id="username" placeholder="@bryanmylee" />
				</fieldset>
				<Dialog.Close model={dialog}>Save changes</Dialog.Close>
				<Dialog.Close model={dialog}>x</Dialog.Close>
			</Dialog.Content>
		</main>
	);
}
