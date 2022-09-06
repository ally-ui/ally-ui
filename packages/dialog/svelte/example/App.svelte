<script lang="ts">
	import Dialog from '../lib/main';

	let open = true;
	let titleNode: HTMLHeadingElement | undefined | null;
	$: if (titleNode != null) {
		titleNode.style.color = 'gray';
	}
	let outside = false;
	let escape = true;
	let returnFocus: HTMLElement | null = null;
</script>

<main>
	<button on:click={() => (outside = !outside)} bind:this={returnFocus}>
		Click outside {outside ? 'deactivates' : 'blocked'}
	</button>
	<button on:click={() => (escape = !escape)}>
		Escape {escape ? 'deactivates' : 'blocked'}
	</button>
	<h1>Ally UI Svelte Dialog</h1>
	<Dialog.Root bind:open initialOpen>
		<div>
			<button on:click={() => (open = !open)}>Manual toggle</button>
			<Dialog.Trigger>Edit profile</Dialog.Trigger>
			{#if open}
				<span>Editing profile...</span>
			{/if}
		</div>
		<Dialog.Content
			asChild
			let:props
			let:ref
			on:closeAutoFocus={(ev) => {
				ev.preventDefault();
				returnFocus?.focus();
			}}
			on:escapeKeyDown={(ev) => {
				if (!escape) {
					ev.preventDefault();
				}
			}}
			on:interactOutside={(ev) => {
				if (!outside) {
					ev.preventDefault();
				}
			}}
		>
			<section {...props} use:ref>
				<Dialog.Title bind:node={titleNode} asChild let:props let:ref>
					<h2 {...props} use:ref>Edit profile</h2>
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
				<Dialog.Close asChild let:props let:ref>
					<span
						on:click={() => console.log('clicked close')}
						{...props}
						use:ref
					>
						x
					</span>
				</Dialog.Close>
			</section>
		</Dialog.Content>
	</Dialog.Root>
	<section>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aspernatur
			sed minus unde eius. Maxime hic, eligendi reprehenderit dignissimos cum
			accusantium, ex consequuntur magni cupiditate non cumque placeat corrupti?
			Saepe, officia est nemo debitis vero minima et reprehenderit, assumenda,
			praesentium ex impedit neque id! Fugiat, suscipit temporibus repudiandae
			repellat aliquam error. Autem, sapiente veniam laudantium provident ex
			iste, aliquid illo fugit nulla in explicabo. Voluptas rerum voluptates,
			sed deleniti eius beatae rem? Illo, ut. Dolorum magnam dolorem facilis,
			ipsa delectus architecto commodi a voluptate ducimus possimus magni animi
			sunt nisi quia saepe dicta necessitatibus praesentium quaerat rerum eaque?
			Aliquam, maiores?
		</p>
		<p>
			Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quo aspernatur
			sed minus unde eius. Maxime hic, eligendi reprehenderit dignissimos cum
			accusantium, ex consequuntur magni cupiditate non cumque placeat corrupti?
			Saepe, officia est nemo debitis vero minima et reprehenderit, assumenda,
			praesentium ex impedit neque id! Fugiat, suscipit temporibus repudiandae
			repellat aliquam error. Autem, sapiente veniam laudantium provident ex
			iste, aliquid illo fugit nulla in explicabo. Voluptas rerum voluptates,
			sed deleniti eius beatae rem? Illo, ut. Dolorum magnam dolorem facilis,
			ipsa delectus architecto commodi a voluptate ducimus possimus magni animi
			sunt nisi quia saepe dicta necessitatibus praesentium quaerat rerum eaque?
			Aliquam, maiores?
		</p>
	</section>
</main>
