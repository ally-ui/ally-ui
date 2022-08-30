<script lang="ts">
	import {DialogTriggerModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel, getDialogRootState} from './context';

	type $$Props = svelteHTML.IntrinsicElements['button'] & {
		node?: HTMLButtonElement | undefined | null;
	};

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTriggerModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = getDialogRootState();

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

<button
	bind:this={node}
	{...component.getAttributes($rootState)}
	{...$$restProps}
	use:eventForwarder
	on:click={() => component.onClick()}
>
	<slot />
</button>
