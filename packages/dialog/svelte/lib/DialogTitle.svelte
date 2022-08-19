<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import {createEventForwarder} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import type {Readable} from 'svelte/store';
	import {getDialogContext} from './context';

	type $$Props = svelteHTML.IntrinsicElements['h1'] & {
		model?: Readable<DialogModel>;
	};

	export let model: Readable<DialogModel> | undefined = undefined;
	const resolvedModel = model ?? getDialogContext();
	if (resolvedModel === undefined) {
		throw new Error(
			'<Dialog.Title /> must have a `model` prop or be a child of `<Dialog.Root/>`',
		);
	}
	const id = $resolvedModel.init('title');

	onMount(() => {
		$resolvedModel.mount(id);
		return () => {
			$resolvedModel.unmount(id);
		};
	});

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

<h1
	bind:this={node}
	{...$resolvedModel.componentAttributes(id)}
	{...$$restProps}
	use:eventForwarder
>
	<slot />
</h1>
