import {createSignal, Show} from 'solid-js';
import Dialog from '../lib/main';

export default function App() {
	const [open, setOpen] = createSignal(true);
	const titleRef = (node: HTMLElement) => {
		node.style.color = 'gray';
	};
	const [outside, setOutside] = createSignal(false);
	const [escape, setEscape] = createSignal(true);
	const [returnFocus, setReturnFocus] = createSignal<HTMLElement | null>(null);

	return (
		<main>
			<button onClick={() => setOutside((o) => !o)} ref={setReturnFocus}>
				Click outside {outside() ? 'deactivates' : 'blocked'}
			</button>
			<button onClick={() => setEscape((e) => !e)}>
				Escape {escape() ? 'deactivates' : 'blocked'}
			</button>
			<h1>Ally UI Solid Dialog</h1>
			<Dialog.Root open={open()} onOpenChange={setOpen} initialOpen>
				<div>
					<button onClick={() => setOpen(!open())}>Manual toggle</button>
					<Dialog.Trigger>Edit profile</Dialog.Trigger>
					<Show when={open()}>
						<span>Editing profile...</span>
					</Show>
				</div>
				<Dialog.Content
					asChild
					onCloseAutoFocus={(ev) => {
						ev.preventDefault();
						returnFocus()?.focus();
					}}
					onEscapeKeyDown={(ev) => {
						if (!escape()) {
							ev.preventDefault();
						}
					}}
					onInteractOutside={(ev) => {
						if (!outside()) {
							ev.preventDefault();
						}
					}}
				>
					{(props) => (
						<section {...props()}>
							<Dialog.Title ref={titleRef} asChild>
								{(props) => <h2 {...props()}>Edit profile</h2>}
							</Dialog.Title>
							<Dialog.Description>
								Make changes to your profile here. Click save when you're done
							</Dialog.Description>
							<fieldset>
								<label for="name">Name</label>
								<input id="name" placeholder="Bryan Lee" />
							</fieldset>
							<fieldset>
								<label for="username">Username</label>
								<input id="username" placeholder="@bryanmylee" />
							</fieldset>
							<Dialog.Close>Save changes</Dialog.Close>
							<Dialog.Close asChild>
								{(props) => (
									<a
										{...props({
											onClick: () => console.log('clicked close'),
										})}
									>
										x
									</a>
								)}
							</Dialog.Close>
						</section>
					)}
				</Dialog.Content>
			</Dialog.Root>
			<section>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
					aspernatur sed minus unde eius. Maxime hic, eligendi reprehenderit
					dignissimos cum accusantium, ex consequuntur magni cupiditate non
					cumque placeat corrupti? Saepe, officia est nemo debitis vero minima
					et reprehenderit, assumenda, praesentium ex impedit neque id! Fugiat,
					suscipit temporibus repudiandae repellat aliquam error. Autem,
					sapiente veniam laudantium provident ex iste, aliquid illo fugit nulla
					in explicabo. Voluptas rerum voluptates, sed deleniti eius beatae rem?
					Illo, ut. Dolorum magnam dolorem facilis, ipsa delectus architecto
					commodi a voluptate ducimus possimus magni animi sunt nisi quia saepe
					dicta necessitatibus praesentium quaerat rerum eaque? Aliquam,
					maiores?
				</p>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo
					aspernatur sed minus unde eius. Maxime hic, eligendi reprehenderit
					dignissimos cum accusantium, ex consequuntur magni cupiditate non
					cumque placeat corrupti? Saepe, officia est nemo debitis vero minima
					et reprehenderit, assumenda, praesentium ex impedit neque id! Fugiat,
					suscipit temporibus repudiandae repellat aliquam error. Autem,
					sapiente veniam laudantium provident ex iste, aliquid illo fugit nulla
					in explicabo. Voluptas rerum voluptates, sed deleniti eius beatae rem?
					Illo, ut. Dolorum magnam dolorem facilis, ipsa delectus architecto
					commodi a voluptate ducimus possimus magni animi sunt nisi quia saepe
					dicta necessitatibus praesentium quaerat rerum eaque? Aliquam,
					maiores?
				</p>
			</section>
		</main>
	);
}
