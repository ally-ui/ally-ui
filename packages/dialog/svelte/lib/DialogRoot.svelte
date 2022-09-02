<script lang="ts" context="module">
	type DialogRootProps = DialogRootModelOptions & Partial<DialogRootModelState>;
</script>

<script lang="ts">
	import {
		DialogRootModel,
		type DialogRootModelOptions,
		type DialogRootModelState,
	} from '@ally-ui/core-dialog';
	import {bindStore, createSyncedOption} from '@ally-ui/svelte';
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
	export let clickOutsideDeactivates: boolean | undefined = undefined;
	const clickOutsideDeactivatesStore = writable(clickOutsideDeactivates);
	const watchClickOutsideDeactivates = bindStore(
		clickOutsideDeactivatesStore,
		(c) => (clickOutsideDeactivates = c),
	);
	$: watchClickOutsideDeactivates(clickOutsideDeactivates);
	export let escapeDeactivates: boolean | undefined = undefined;
	const escapeDeactivatesStore = writable(escapeDeactivates);
	const watchEscapeDeactivates = bindStore(
		escapeDeactivatesStore,
		(e) => (escapeDeactivates = e),
	);
	$: watchEscapeDeactivates(escapeDeactivates);
	export let returnFocusTo: HTMLElement | undefined = undefined;
	const returnFocusToStore = writable(returnFocusTo);
	const watchReturnFocusTo = bindStore(
		returnFocusToStore,
		(r) => (returnFocusTo = r),
	);
	$: watchReturnFocusTo(returnFocusTo);

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
	createSyncedOption({
		option: openStore,
		onOptionChange: (open) =>
			rootState.update((prevState) => ({...prevState, open})),
		internal: derived(rootState, ($rootState) => $rootState.open),
	});
	createSyncedOption({
		option: modalStore,
		onOptionChange: (modal) =>
			rootState.update((prevState) => ({...prevState, modal})),
	});
	createSyncedOption({
		option: clickOutsideDeactivatesStore,
		onOptionChange: (clickOutsideDeactivates) =>
			rootState.update((prevState) => ({
				...prevState,
				clickOutsideDeactivates,
			})),
	});
	createSyncedOption({
		option: escapeDeactivatesStore,
		onOptionChange: (escapeDeactivates) =>
			rootState.update((prevState) => ({...prevState, escapeDeactivates})),
	});
	createSyncedOption({
		option: returnFocusToStore,
		onOptionChange: (returnFocusTo) =>
			rootState.update((prevState) => ({...prevState, returnFocusTo})),
	});
	$: rootModel.setState($rootState);

	setDialogRootModel(rootModel);
	setDialogRootState(rootState);
</script>

<slot />
