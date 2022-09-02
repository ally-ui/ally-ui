import React from 'react';
import Dialog from '../lib/main';

export default function App() {
	const [open, setOpen] = React.useState(true);
	const titleRef = React.useCallback((node: HTMLElement | null) => {
		if (node !== null) {
			node.style.color = 'gray';
		}
	}, []);
	const [outside, setOutside] = React.useState(false);
	const [escape, setEscape] = React.useState(true);
	const [returnFocus, setReturnFocus] = React.useState<HTMLElement | null>(
		null,
	);

	return (
		<main>
			<button onClick={() => setOutside((o) => !o)} ref={setReturnFocus}>
				Click outside {outside ? 'deactivates' : 'blocked'}
			</button>
			<button onClick={() => setEscape((e) => !e)}>
				Escape {escape ? 'deactivates' : 'blocked'}
			</button>
			<h1>Ally UI React Dialog</h1>
			<Dialog.Root
				open={open}
				onOpenChange={setOpen}
				initialOpen
				clickOutsideDeactivates={outside}
				escapeDeactivates={escape}
				returnFocusTo={returnFocus ?? undefined}
			>
				<div>
					<button onClick={() => setOpen((o) => !o)}>Manual toggle</button>
					<Dialog.Trigger>Edit profile</Dialog.Trigger>
					{open && <span>Editing profile...</span>}
				</div>
				<Dialog.Content asChild>
					{(props) => (
						<section {...props}>
							<Dialog.Title ref={titleRef} asChild>
								{(props) => <h2 {...props}>Edit profile</h2>}
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
							<Dialog.Close asChild>
								{(props) => <a {...props}>x</a>}
							</Dialog.Close>
						</section>
					)}
				</Dialog.Content>
			</Dialog.Root>
		</main>
	);
}
