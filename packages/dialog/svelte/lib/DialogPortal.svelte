<script lang="ts" context="module">
	type DialogPortalProps = {
		container?: HTMLElement;
		forceMount?: boolean;
	};
</script>

<script lang="ts">
	import Portal from 'svelte-portal';
	import {readable} from 'svelte/store';
	import {
		getDialogRootModel,
		getDialogRootState,
		setDialogPortalForceMount,
	} from './context';

	type $$Props = DialogPortalProps;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Portal/> must be a child of `<Dialog.Root/>`');
	}

	const rootState = getDialogRootState() ?? readable(rootModel.state);

	export let container: HTMLElement | undefined = undefined;
	export let forceMount: boolean | undefined = undefined;
	setDialogPortalForceMount(forceMount);
</script>

<Portal target={container}>
	{#if $rootState.open}
		<slot />
	{/if}
</Portal>
