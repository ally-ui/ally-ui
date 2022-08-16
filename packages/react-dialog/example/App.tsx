import {useState} from 'react';
import {useDialog, Dialog} from '../lib/main';

export default function App() {
	const [open, setOpen] = useState(true);
	const [dialog] = useDialog({
		open,
		onOpenChange: setOpen,
	});

	return (
		<div className="App">
			<h1>Ally UI React Dialog</h1>
			<div className="card">
				<button onClick={() => setOpen((o) => !o)}>Manual trigger</button>
				<Dialog.Trigger model={dialog}>Edit profile</Dialog.Trigger>
			</div>
			<Dialog.Content model={dialog}>
				<Dialog.Title model={dialog}>Edit profile</Dialog.Title>
				<Dialog.Description model={dialog}>
					Make changes to your profile here. Click save when you're done
				</Dialog.Description>
				<fieldset>
					<label htmlFor="name">Name</label>
					<input id="name" defaultValue="Bryan Lee" />
				</fieldset>
				<fieldset>
					<label htmlFor="username">Username</label>
					<input id="username" defaultValue="@bryanmylee" />
				</fieldset>
				<Dialog.Close model={dialog}>Save changes</Dialog.Close>
				<Dialog.Close model={dialog}>x</Dialog.Close>
			</Dialog.Content>
		</div>
	);
}
