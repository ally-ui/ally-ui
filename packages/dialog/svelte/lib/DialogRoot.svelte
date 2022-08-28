<script lang="ts">
	import {writable} from 'svelte/store';
	import {setDialogContext} from './context';
	import {createDialog} from './createDialog';

	interface $$Props {
		open?: boolean;
		initialOpen?: boolean;
	}
	export let open: boolean | undefined = undefined;
	export let initialOpen: boolean | undefined = undefined;

	const openStore = writable(open);
	$: $openStore, dispatchOpen();
	function dispatchOpen() {
		if ($openStore !== undefined) {
			open = $openStore;
		}
	}
	$: open, updateOpenStore();
	function updateOpenStore() {
		if (open !== undefined) {
			$openStore = open;
		}
	}

	const model = createDialog({
		openStore,
		initialOpen,
	});
	setDialogContext(model);
</script>

<slot />
