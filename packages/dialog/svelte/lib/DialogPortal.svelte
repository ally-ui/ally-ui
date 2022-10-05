<script lang="ts" context="module">
	type DialogPortalProps = {
		container?: HTMLElement | string;
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
	if (rootModel == null) {
		throw new Error('<Dialog.Portal/> must be a child of `<Dialog.Root/>`');
	}

	const rootState = getDialogRootState() ?? readable(rootModel.state.value);

	export let container: HTMLElement | string | undefined = undefined;
	export let forceMount: boolean | undefined = undefined;
	setDialogPortalForceMount(forceMount);
</script>

{#if $rootState.open}
	<Portal target={container}>
		<slot />
	</Portal>
{/if}
