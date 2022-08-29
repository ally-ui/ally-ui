<script lang="ts">
	import {DialogModel, type DialogModelState} from '@ally-ui/core-dialog';
	import {createSyncedOption} from '@ally-ui/svelte';
	import {readable, writable} from 'svelte/store';
	import {setDialogContext} from './context';

	interface $$Props {
		open?: boolean;
		initialOpen?: boolean;
	}
	export let open: boolean | undefined = undefined;
	export let initialOpen: boolean | undefined = undefined;

	const openStore = writable(open);
	// TODO Extract this synchronization behavior.
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

	// TODO Generate SSR-safe IDs.
	const id = '0';
	const model = new DialogModel(id, {initialOpen});
	const state = writable(model.initialState);
	model.setOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: (updater) => {
			if (updater instanceof Function) {
				state.update(updater);
			} else {
				state.set(updater);
			}
		},
	}));
	// TODO Improve the interface for option synchronization.
	const [updateOpenOption, watchOpenOption] = createSyncedOption(
		openStore,
		($open) => {
			state.update((prevState) => ({...prevState, open: $open}));
		},
	);
	const modelStore = readable(model, (set) => {
		const unsubscribeState = state.subscribe(($state) => {
			model.setState($state);
			updateOpenOption($state.open);
			set(model);
		});

		const unsubscribeOpen = watchOpenOption();

		return () => {
			unsubscribeState();
			unsubscribeOpen?.();
		};
	});

	setDialogContext(modelStore);
</script>

<slot />
