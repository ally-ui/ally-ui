<script lang="ts">
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogContext} from './context';

	type $$Props = svelteHTML.IntrinsicElements['div'] & {
		node?: HTMLDivElement | undefined | null;
	};

	const model = getDialogContext();
	if (model === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	const id = $model.init('content');

	onMount(() => {
		$model.mount(id);
		return () => {
			$model.unmount(id);
		};
	});

	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);
	function bindNode(node?: HTMLElement | null) {
		if (node == null) {
			$model.unbindNode(id);
		} else {
			$model.bindNode(id, node);
		}
	}

	const eventForwarder = createEventForwarder(get_current_component());
</script>

{#if $model.getState().open}
	<div
		bind:this={node}
		{...$model.componentAttributes(id)}
		{...$$restProps}
		use:eventForwarder
	>
		<slot />
	</div>
{/if}
