<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import type {Readable} from 'svelte/store';

	export let model: Readable<DialogModel>;
	const id = $model.init('description');

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

<p bind:this={node} {...$model.submodelDOMAttributes(id)}>
	<slot />
</p>
