<script lang="ts" context="module">
	type DialogCloseProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['button'] & {
			node?: HTMLButtonElement | undefined | null;
			asChild?: TAsChild;
		};
	type DialogCloseSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<
			TAsChild,
			DialogCloseModelAttributes,
			RefAction<{
				click: [(ev: Event) => void, undefined];
			}>
		>;
	};
</script>

<script lang="ts">
	import {
		DialogCloseModel,
		type DialogCloseModelAttributes,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createRefAction,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogCloseProps<TAsChild>;
	type $$Slots = DialogCloseSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogCloseModel(rootModel, {}),
	);
	const id = component.getId();

	onMount(() => {
		rootModel.mountComponent(id);
		return () => {
			rootModel.unmountComponent(id);
		};
	});

	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);
	function bindNode(node?: HTMLElement | null) {
		if (node == null) {
			rootModel?.unbindComponent(id);
		} else {
			rootModel?.bindComponent(id, node);
		}
	}

	function handleClick() {
		component.onClick();
	}

	const ref = createRefAction((n) => (node = n), {
		click: [handleClick, undefined],
	});

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: component.getAttributes(),
		ref,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder(get_current_component());
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		bind:this={node}
		{...component.getAttributes()}
		{...$$restProps}
		use:eventForwarder
		on:click={() => component.onClick()}
	>
		<slot />
	</button>
{/if}
