<script lang="ts" context="module">
	type DialogContentProps<TAsChild extends true | undefined> =
		DialogContentModelOptions &
			svelteHTML.IntrinsicElements['div'] & {
				node?: HTMLDivElement | undefined | null;
				asChild?: TAsChild;
			};
	type DialogContentSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<TAsChild, DialogContentModelAttributes, RefAction>;
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
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {onMount} from 'svelte/internal';
	import {readable} from 'svelte/store';
	import {getDialogRootModel, getDialogRootState} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogContentProps<TAsChild>;
	type $$Slots = DialogContentSlots<TAsChild>;
	type $$Events = DialogContentEvents;

	const dispatch = createNativeEventDispatcher<DialogContentEvents>();

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	export let forceMount: boolean | undefined = undefined;
	const component = rootModel.registerComponent(
		new DialogContentModel(rootModel, {
			forceMount,
			onOpenAutoFocus: (ev) => dispatch('openAutoFocus', ev),
			onCloseAutoFocus: (ev) => dispatch('closeAutoFocus', ev),
			onEscapeKeyDown: (ev) => dispatch('escapeKeyDown', ev),
			onInteractOutside: (ev) => dispatch('interactOutside', ev),
		}),
	);
	const id = component.getId();

	const rootState = getDialogRootState() ?? readable(rootModel.state);
	$: derivedState = component.deriveState($rootState);

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
		props: component.getAttributes($rootState),
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
			{...component.getAttributes($rootState)}
			{...$$restProps}
			use:eventForwarder
		>
			<slot />
		</div>
	{/if}
{/if}
