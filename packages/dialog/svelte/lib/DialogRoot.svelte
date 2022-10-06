<script lang="ts" context="module">
	type DialogRootProps = DialogRootModelProps & Partial<DialogRootModelState>;
</script>

<script lang="ts">
	import {
		DialogRootModel,
		type DialogRootModelProps,
		type DialogRootModelState,
	} from '@ally-ui/core-dialog';
	import {createSyncedOption, useComponentModel} from '@ally-ui/svelte';
	import {derived} from 'svelte/store';
	import {setDialogRootModel, setDialogRootState} from './context';

	type $$Props = DialogRootProps;

	export let initialOpen: boolean | undefined = undefined;
	export let open: boolean | undefined = undefined;
	export let modal: boolean | undefined = undefined;

	// TODO #19 Generate SSR-safe IDs.
	const id = '0';
	const rootModel = new DialogRootModel(
		id,
		{initialOpen, modal},
		{
			openChange: (o) => (open = o),
		},
	);
	const rootState = useComponentModel(rootModel);
	// TODO #44 Reduce syncing boilerplate.
	const watchOpen = createSyncedOption<boolean>({
		initialOption: open,
		onOptionChange: (open) =>
			rootState.update((prevState) => ({...prevState, open})),
		internal: derived(rootState, ($rootState) => $rootState.open),
		onInternalChange: (o) => (open = o),
	});
	$: watchOpen(open);
	const watchModal = createSyncedOption<boolean>({
		onOptionChange: (modal) =>
			rootState.update((prevState) => ({...prevState, modal})),
	});
	$: watchModal(modal);

	setDialogRootModel(rootModel);
	setDialogRootState(rootState);
</script>

<slot />
