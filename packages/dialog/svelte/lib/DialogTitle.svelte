<script lang="ts">
	import {DialogTitleModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type $$Props = svelteHTML.IntrinsicElements['h1'] & {
		node?: HTMLHeadingElement | undefined | null;
	};

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTitleModel(rootModel, {}),
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
			rootModel.unbindComponent(id);
		} else {
			rootModel.bindComponent(id, node);
		}
	}

	const eventForwarder = createEventForwarder(get_current_component());
</script>

<h1
	bind:this={node}
	{...component.getAttributes()}
	{...$$restProps}
	use:eventForwarder
>
	<slot />
</h1>
