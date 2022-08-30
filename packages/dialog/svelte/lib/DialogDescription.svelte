<script lang="ts">
	import {DialogDescriptionModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type $$Props = svelteHTML.IntrinsicElements['p'] & {
		node?: HTMLParagraphElement | undefined | null;
	};

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error(
			'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
		);
	}
	const component = rootModel.registerComponent(
		new DialogDescriptionModel(rootModel, {}),
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

<p
	bind:this={node}
	{...component.getAttributes()}
	{...$$restProps}
	use:eventForwarder
>
	<slot />
</p>
