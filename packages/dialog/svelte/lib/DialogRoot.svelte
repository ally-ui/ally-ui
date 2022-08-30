<script lang="ts">
	import {DialogRootModel} from '@ally-ui/core-dialog';
	import {bindStore, createSyncedOption} from '@ally-ui/svelte';
	import {derived, writable} from 'svelte/store';
	import {setDialogRootModel, setDialogRootState} from './context';
	import type {DialogRootProps} from './DialogRoot';

	type $$Props = DialogRootProps;

	export let open: boolean | undefined = undefined;
	const openStore = writable(open);
	const watchOpen = bindStore(openStore, (o) => (open = o));
	$: watchOpen(open);

	export let initialOpen: boolean | undefined = undefined;

	// TODO #19 Generate SSR-safe IDs.
	const id = '0';
	const rootModel = new DialogRootModel(id, {initialOpen});
	const rootState = writable(rootModel.initialState);
	rootModel.setStateOptions((prevOptions) => ({
		...prevOptions,
		requestStateUpdate: (updater) => {
			if (updater instanceof Function) {
				rootState.update(updater);
			} else {
				rootState.set(updater);
			}
		},
	}));
	createSyncedOption({
		option: openStore,
		onOptionChange: ($open) =>
			rootState.update((prevState) => ({...prevState, open: $open})),
		internal: derived(rootState, ($state) => $state.open),
	});
	$: rootModel.setState($rootState);

	setDialogRootModel(rootModel);
	setDialogRootState(rootState);
</script>

<slot />
