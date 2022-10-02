<script lang="ts" context="module">
	type DialogDescriptionProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['p'] & {
			node?: HTMLParagraphElement | undefined | null;
			asChild?: TAsChild;
		};
	type DialogDescriptionSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<TAsChild, DialogDescriptionModelAttributes, RefAction>;
	};
</script>

<script lang="ts">
	import {
		DialogDescriptionModel,
		type DialogDescriptionModelAttributes,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createRefAction,
		mergeSlotProps,
		svelteProps,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogDescriptionProps<TAsChild>;
	type $$Slots = DialogDescriptionSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error(
			'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
		);
	}
	const component = rootModel.registerComponent(
		new DialogDescriptionModel(rootModel, {}),
	);
	const id = component.getId();

	onMount(() => {
		rootModel.mountComponent(id);
		return () => {
			rootModel.unmountComponent(id);
			rootModel.deregisterComponent(id);
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
	<p
		bind:this={node}
		{...mergeSlotProps(svelteProps(component.getAttributes()), $$restProps)}
		use:eventForwarder
	>
		<slot />
	</p>
{/if}
