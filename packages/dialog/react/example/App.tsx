import React from 'react';
import Dialog from '../lib/main';

export default function App() {
	const [open, setOpen] = React.useState(true);
	const titleRef = React.useCallback((node: HTMLElement | null) => {
		if (node !== null) {
			node.style.color = 'gray';
		}
	}, []);

	return (
		<main>
			<h1>Ally UI React Dialog</h1>
			<Dialog.Root open={open} onOpenChange={setOpen} initialOpen>
				<div>
					<button onClick={() => setOpen((o) => !o)}>Manual toggle</button>
					<Dialog.Trigger>Edit profile</Dialog.Trigger>
					{open && <span>Editing profile...</span>}
				</div>
				<Dialog.Content asChild>
					{(p) => (
						<section {...p}>
							<Dialog.Title ref={titleRef} asChild>
								{(p) => <h2 {...p}>Edit profile</h2>}
							</Dialog.Title>
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
							<Dialog.Close asChild>{(p) => <a {...p}>x</a>}</Dialog.Close>
						</section>
					)}
				</Dialog.Content>
			</Dialog.Root>
		</main>
	);
}
