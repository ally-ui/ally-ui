<script lang="ts">
	import type {DialogModel} from '@ally-ui/core-dialog';
	import type {Readable} from 'svelte/store';
	import {setDialogContext} from './context';

	export let model: Readable<DialogModel>;
	setDialogContext(model);
</script>

<slot />
