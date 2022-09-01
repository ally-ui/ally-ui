<script lang="ts" context="module">
	export interface DialogRootProps extends DialogRootModelOptions {
		open?: boolean;
	}
</script>

<script lang="ts">
	import {
		DialogRootModel,
		type DialogRootModelOptions,
	} from '@ally-ui/core-dialog';
	import {bindStore, createSyncedOption} from '@ally-ui/svelte';
	import {derived, writable} from 'svelte/store';
	import {setDialogRootModel, setDialogRootState} from './context';

	type $$Props = DialogRootProps;

	export let open: boolean | undefined = undefined;
	const openStore = writable(open);
	const watchOpen = bindStore(openStore, (o) => (open = o));
	$: watchOpen(open);

	export let initialOpen: boolean | undefined = undefined;
	export let modal: boolean | undefined = undefined;

	// TODO #19 Generate SSR-safe IDs.
	const id = '0';
	const rootModel = new DialogRootModel(id, {initialOpen, modal});
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
