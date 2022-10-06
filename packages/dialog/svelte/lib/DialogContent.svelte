<script lang="ts" context="module">
	type DialogContentProps<TAsChild extends true | undefined> =
		DialogContentModelProps &
			svelteHTML.IntrinsicElements['div'] & {
				node?: HTMLDivElement | undefined | null;
				asChild?: TAsChild;
			};
	type DialogContentSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<
			TAsChild,
			DialogContentModelAttributes,
			svelteHTML.IntrinsicElements['div'],
			RefAction
		>;
	};
</script>

<script lang="ts">
	import {
		DialogContentModel,
		type DialogContentModelAttributes,
		type DialogContentModelEvents,
		type DialogContentModelProps,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createNativeEventDispatcher,
		createRefAction,
		mergeSvelteProps,
		svelteProps,
		useNodeComponentModel,
		type DefaultSlot,
		type RefAction,
		type SvelteEventHandlers,
	} from '@ally-ui/svelte';
	import {readable} from 'svelte/store';
	import {
		getDialogPortalForceMount,
		getDialogRootModel,
		getDialogRootState,
	} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogContentProps<TAsChild>;
	type $$Slots = DialogContentSlots<TAsChild>;
	type $$Events = SvelteEventHandlers<DialogContentModelEvents>;

	const dispatch = createNativeEventDispatcher<$$Events>();

	const rootModel = getDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	export let forceMount: boolean | undefined = undefined;
	export let allowPinchZoom: boolean | undefined = undefined;
	const component = new DialogContentModel(
		{
			forceMount: forceMount ?? getDialogPortalForceMount(),
			allowPinchZoom,
		},
		{
			openAutoFocus: (ev) => dispatch('openAutoFocus', ev),
			closeAutoFocus: (ev) => dispatch('closeAutoFocus', ev),
			escapeKeyDown: (ev) => dispatch('escapeKeyDown', ev),
			interactOutside: (ev) => dispatch('interactOutside', ev),
		},
		rootModel,
	);

	const [bindNode, state] = useNodeComponentModel(component);
	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);

	// Note that we do not need to sync options for event handlers because Svelte
	// does not use handlers but emits events instead.

	const rootState = getDialogRootState() ?? readable(rootModel.state.value);
	$: derivedState = component.derived($state, $rootState);

	const ref = createRefAction((n) => (node = n));

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: (userProps: svelteHTML.IntrinsicElements['div']) =>
			mergeSvelteProps(
				svelteProps(component.attributes($rootState)),
				$$restProps,
				userProps,
			),
		ref,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder([
		'openAutoFocus',
		'closeAutoFocus',
		'escapeKeyDown',
		'interactOutside',
	]);
</script>

{#if derivedState.show}
	{#if asChild}
		<slot {...slotProps} />
	{:else}
		<div
			bind:this={node}
			{...mergeSvelteProps(
				svelteProps(component.attributes($rootState)),
				$$restProps,
			)}
			use:eventForwarder
		>
			<slot {...slotProps} />
		</div>
	{/if}
{/if}
