<script lang="ts">
	import {DialogContentModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {readable} from 'svelte/store';
	import {getDialogRootModel, getDialogRootState} from './context';
	import type {DialogContentProps} from './DialogContent';

	type $$Props = DialogContentProps;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogContentModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = getDialogRootState() ?? readable(rootModel.getState());

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

{#if $rootState.open}
	<div
		bind:this={node}
		{...component.getAttributes($rootState)}
		{...$$restProps}
		use:eventForwarder
	>
		<slot />
	</div>
{/if}
