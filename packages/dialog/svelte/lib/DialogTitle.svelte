<script lang="ts" context="module">
	type DialogTitleProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['h1'] & {
			node?: HTMLHeadingElement | undefined | null;
			asChild?: TAsChild;
		};
	type DialogTitleSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<TAsChild, DialogTitleModelAttributes, RefAction>;
	};
</script>

<script lang="ts">
	import {
		DialogTitleModel,
		type DialogTitleModelAttributes,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createRefAction,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogTitleProps<TAsChild>;
	type $$Slots = DialogTitleSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTitleModel(rootModel, {}),
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

	const ref = createRefAction((n) => (node = n));

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: component.getAttributes(),
		ref,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder();
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<h1
		bind:this={node}
		{...component.getAttributes()}
		{...$$restProps}
		use:eventForwarder
	>
		<slot />
	</h1>
{/if}
