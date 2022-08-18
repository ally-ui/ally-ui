<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component} from 'svelte/internal';
	import type {Readable} from 'svelte/store';

	type $$Props = svelteHTML.IntrinsicElements['button'] & {
		model: Readable<DialogModel>;
	};

	export let model: Readable<DialogModel>;
	const id = $model.init('trigger');

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

<button
	bind:this={node}
	{...$model.submodelDOMAttributes(id)}
	{...$$restProps}
	use:eventForwarder
	on:click={() => $model.setState((prevState) => ({...prevState, open: true}))}
>
	<slot />
</button>
