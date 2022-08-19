<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component} from 'svelte/internal';
	import type {Readable} from 'svelte/store';

	type $$Props = svelteHTML.IntrinsicElements['p'] & {
		model: Readable<DialogModel>;
	};

	export let model: Readable<DialogModel>;
	const id = $model.init('description');

	let node: HTMLElement | null = null;
	$: bindNode(node);
	function bindNode(node: HTMLElement | null) {
		if (node === null) {
			$model.unbindNode(id);
		} else {
			$model.bindNode(id, node);
		}
	}

	const eventForwarder = createEventForwarder(get_current_component());
</script>

<p
	bind:this={node}
	{...$model.submodelDOMAttributes(id)}
	{...$$restProps}
	use:eventForwarder
>
	<slot />
</p>
