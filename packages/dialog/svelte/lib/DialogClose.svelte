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
			svelteHTML.IntrinsicElements['button'],
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
		mergeSvelteProps,
		svelteProps,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogCloseProps<TAsChild>;
	type $$Slots = DialogCloseSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogCloseModel({}, undefined, rootModel);

	onMount(() => {
		component.mount();
		return () => {
			component.unmount();
			component.unregister();
		};
	});

	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);
	function bindNode(node?: HTMLElement | null) {
		if (node == null) {
			component.unbind();
		} else {
			component.bind(node);
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
		props: (userProps: svelteHTML.IntrinsicElements['button']) =>
			mergeSvelteProps(
				svelteProps(component.attributes()),
				$$restProps,
				userProps,
			),
		ref,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder();
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		bind:this={node}
		{...mergeSvelteProps(svelteProps(component.attributes()), $$restProps)}
		use:eventForwarder
		on:click={handleClick}
	>
		<slot {...slotProps} />
	</button>
{/if}
