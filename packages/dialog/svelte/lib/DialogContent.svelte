<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component} from 'svelte/internal';
	import type {Readable} from 'svelte/store';
	import {getDialogContext} from './context';

	type $$Props = svelteHTML.IntrinsicElements['div'] & {
		model?: Readable<DialogModel>;
	};

	export let model: Readable<DialogModel> | undefined = undefined;
	const resolvedModel = model ?? getDialogContext();
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Content /> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = $resolvedModel.init('content');

	let node: HTMLElement | null = null;
	$: bindNode(node);
	function bindNode(node: HTMLElement | null) {
		if (node === null) {
			$resolvedModel.unbindNode(id);
		} else {
			$resolvedModel.bindNode(id, node);
		}
	}

	const eventForwarder = createEventForwarder(get_current_component());
</script>

{#if $resolvedModel.getState().open}
	<div
		bind:this={node}
		{...$resolvedModel.submodelDOMAttributes(id)}
		{...$$restProps}
		use:eventForwarder
	>
		<slot />
	</div>
{/if}
