import React from 'react';
import {Dialog} from '../lib/main';

export default function App() {
	const [open, setOpen] = React.useState(false);

	return (
		<main>
			<h1>Ally UI React Dialog</h1>
			<Dialog.Root open={open} onOpenChange={setOpen}>
				<div>
					<button onClick={() => setOpen((o) => !o)}>Manual toggle</button>
					<Dialog.Trigger>Edit profile</Dialog.Trigger>
				</div>
				<Dialog.Content>
					<Dialog.Title>Edit profile</Dialog.Title>
					<Dialog.Description>
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
					<Dialog.Close>Save changes</Dialog.Close>
					<Dialog.Close>x</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</main>
	);
}
