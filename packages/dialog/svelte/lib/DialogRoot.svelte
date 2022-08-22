<script lang="ts">
	import type {ReadOrWritable} from '@ally-ui/svelte';
	import {setDialogContext} from './context';
	import type {CreateDialogOptions} from './createDialog';
	import createDialog from './createDialog';

	interface $$Props extends CreateDialogOptions {}
	export let open: ReadOrWritable<boolean> | undefined = undefined;
	export let initialOpen: boolean | undefined = undefined;
	const model = createDialog({
		open,
		initialOpen,
	});
	setDialogContext(model);
</script>

<slot />
