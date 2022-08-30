<script lang="ts" context="module">
	export type DialogCloseProps = svelteHTML.IntrinsicElements['button'] & {
		node?: HTMLButtonElement | undefined | null;
	};
</script>

<script lang="ts">
	import {DialogCloseModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type $$Props = DialogCloseProps;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogCloseModel(rootModel, {}),
	);
	const id = component.getId();

	onMount(() => {
		rootModel.mountComponent(id);
		return () => {
			rootModel.unmountComponent(id);
		};
	});

	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);
	function bindNode(node?: HTMLElement | null) {
		if (node == null) {
			rootModel?.unbindComponent(id);
		} else {
			rootModel?.bindComponent(id, node);
		}
	}

	const eventForwarder = createEventForwarder(get_current_component());
</script>

<button
	bind:this={node}
	{...component.getAttributes()}
	{...$$restProps}
	use:eventForwarder
	on:click={() => component.onClick()}
>
	<slot />
</button>
