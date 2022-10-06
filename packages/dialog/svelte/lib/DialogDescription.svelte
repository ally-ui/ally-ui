<script lang="ts" context="module">
	type DialogDescriptionProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['p'] & {
			node?: HTMLParagraphElement | undefined | null;
			asChild?: TAsChild;
		};
	type DialogDescriptionSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<
			TAsChild,
			DialogDescriptionModelAttributes,
			svelteHTML.IntrinsicElements['p'],
			RefAction
		>;
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
		mergeSvelteProps,
		svelteProps,
		useNodeComponentModel,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogDescriptionProps<TAsChild>;
	type $$Slots = DialogDescriptionSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel == null) {
		throw new Error(
			'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
		);
	}
	const component = new DialogDescriptionModel({}, undefined, rootModel);

	const [bindNode] = useNodeComponentModel(component);
	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);

	const ref = createRefAction((n) => (node = n));

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: (userProps: svelteHTML.IntrinsicElements['p']) =>
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
	<p
		bind:this={node}
		{...mergeSvelteProps(svelteProps(component.attributes()), $$restProps)}
		use:eventForwarder
	>
		<slot {...slotProps} />
	</p>
{/if}
