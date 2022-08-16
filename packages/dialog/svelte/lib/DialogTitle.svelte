<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import type {Readable} from 'svelte/store';

	export let model: Readable<DialogModel>;
	const id = $model.init('title');

	let node: HTMLElement | undefined;
	$: bindNode(node);
	function bindNode(node?: HTMLElement) {
		if (node === undefined) {
			$model.unbindNode(id);
		} else {
			$model.bindNode(id, node);
		}
	}
</script>

<h1 bind:this={node} {...$model.submodelDOMAttributes(id)}>
	<slot />
</h1>
