<script lang="ts" context="module">
	type DialogContentProps<TAsChild extends true | undefined> =
		DialogContentModelOptions &
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
	type DialogContentEvents = {
		openAutoFocus: Event;
		closeAutoFocus: Event;
		escapeKeyDown: KeyboardEvent;
		interactOutside: MouseEvent | TouchEvent;
	};
</script>

<script lang="ts">
	import {
		DialogContentModel,
		type DialogContentModelAttributes,
		type DialogContentModelOptions,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createNativeEventDispatcher,
		createRefAction,
		mergeSvelteProps,
		svelteProps,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {onMount} from 'svelte/internal';
	import {readable} from 'svelte/store';
	import {
		getDialogPortalForceMount,
		getDialogRootModel,
		getDialogRootState,
	} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogContentProps<TAsChild>;
	type $$Slots = DialogContentSlots<TAsChild>;
	type $$Events = DialogContentEvents;

	const dispatch = createNativeEventDispatcher<DialogContentEvents>();

	const rootModel = getDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	export let forceMount: boolean | undefined = undefined;
	const component = new DialogContentModel(
		{
			forceMount: forceMount ?? getDialogPortalForceMount(),
			onOpenAutoFocus: (ev) => dispatch('openAutoFocus', ev),
			onCloseAutoFocus: (ev) => dispatch('closeAutoFocus', ev),
			onEscapeKeyDown: (ev) => dispatch('escapeKeyDown', ev),
			onInteractOutside: (ev) => dispatch('interactOutside', ev),
		},
		rootModel,
	);

	const state = component.initialState;
	// Note that we do not need to sync options for event handlers because Svelte
	// does not use handlers but emits events instead.

	const rootState = getDialogRootState() ?? readable(rootModel.state);
	$: derivedState = component.derived($rootState);

	onMount(() => {
		component.onMount();
		return () => {
			component.onUnmount();
			component.onDeregister();
		};
	});

	export let node: HTMLElement | null | undefined = null;
	$: bindNode(node);
	function bindNode(node?: HTMLElement | null) {
		if (node == null) {
			component.onUnbind();
		} else {
			component.onBind(node);
		}
	}

	const ref = createRefAction((n) => (node = n));

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: (userProps: svelteHTML.IntrinsicElements['div']) =>
			mergeSvelteProps(
				svelteProps(component.attributes(state, $rootState)),
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
				svelteProps(component.attributes(state, $rootState)),
				$$restProps,
			)}
			use:eventForwarder
		>
			<slot {...slotProps} />
		</div>
	{/if}
{/if}
