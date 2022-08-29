<script lang="ts">
	import {DialogModel} from '@ally-ui/core-dialog';
	import {bindStore, createSyncedOption} from '@ally-ui/svelte';
	import {derived, readable, writable} from 'svelte/store';
	import {setDialogContext} from './context';

	interface $$Props {
		open?: boolean;
		initialOpen?: boolean;
	}
	export let open: boolean | undefined = undefined;
	const openStore = writable(open);
	const watchOpen = bindStore(openStore, (o) => (open = o));
	$: watchOpen(open);

	export let initialOpen: boolean | undefined = undefined;

	// TODO #19 Generate SSR-safe IDs.
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
	createSyncedOption({
		option: openStore,
		onOptionChange: ($open) =>
			state.update((prevState) => ({...prevState, open: $open})),
		internal: derived(state, ($state) => $state.open),
	});
	const modelStore = readable(model, (set) => {
		return state.subscribe(($state) => {
			model.setState($state);
			set(model);
		});
	});

	setDialogContext(modelStore);
</script>

<slot />
