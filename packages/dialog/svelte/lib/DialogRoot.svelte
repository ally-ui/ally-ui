<script lang="ts" context="module">
	type DialogRootProps = DialogRootModelOptions & Partial<DialogRootModelState>;
</script>

<script lang="ts">
	import {
		DialogRootModel,
		type DialogRootModelOptions,
		type DialogRootModelState,
	} from '@ally-ui/core-dialog';
	import {bindStore, createSyncedOptionStore} from '@ally-ui/svelte';
	import {derived, writable} from 'svelte/store';
	import {setDialogRootModel, setDialogRootState} from './context';

	type $$Props = DialogRootProps;

	export let initialOpen: boolean | undefined = undefined;
	// TODO #41 Remove unnecessary store overhead for each option.
	export let open: boolean | undefined = undefined;
	const openStore = writable(open);
	const watchOpen = bindStore(openStore, (o) => (open = o));
	$: watchOpen(open);
	export let modal: boolean | undefined = undefined;
	const modalStore = writable(modal);
	const watchModal = bindStore(modalStore, (m) => (modal = m));
	$: watchModal(modal);

	// TODO #19 Generate SSR-safe IDs.
	const id = '0';
	const rootModel = new DialogRootModel(id, {initialOpen, modal});
	const rootState = writable(rootModel.initialState);
	rootModel.requestStateUpdate = (updater) => {
		if (updater instanceof Function) {
			rootState.update(updater);
		} else {
			rootState.set(updater);
		}
	};
	// TODO #44 Reduce syncing boilerplate.
	createSyncedOptionStore({
		option: openStore,
		onOptionChange: (open) =>
			rootState.update((prevState) => ({...prevState, open})),
		internal: derived(rootState, ($rootState) => $rootState.open),
	});
	createSyncedOptionStore({
		option: modalStore,
		onOptionChange: (modal) =>
			rootState.update((prevState) => ({...prevState, modal})),
	});
	$: rootModel.setState($rootState);

	setDialogRootModel(rootModel);
	setDialogRootState(rootState);
</script>

<slot />
