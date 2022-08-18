<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component} from 'svelte/internal';
	import type {Readable} from 'svelte/store';

	type $$Props = svelteHTML.IntrinsicElements['div'] & {
		model: Readable<DialogModel>;
	};

	export let model: Readable<DialogModel>;
	const id = $model.init('content');

	let node: HTMLElement | undefined;
	$: bindNode(node);
	function bindNode(node?: HTMLElement) {
		if (node === undefined) {
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
		{...$model.submodelDOMAttributes(id)}
		{...$$restProps}
		use:eventForwarder
	>
		<slot />
	</div>
{/if}
