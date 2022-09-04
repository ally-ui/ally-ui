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
</script>

<script lang="ts">
	import {
		DialogContentModel,
		type DialogContentModelAttributes,
		type DialogContentModelOptions,
	} from '@ally-ui/core-dialog';
	import {
		bindStore,
		createEventForwarder,
		createRefAction,
		createSyncedOption,
		type DefaultSlot,
		type RefAction,
	} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {readable, writable} from 'svelte/store';
	import {getDialogRootModel, getDialogRootState} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogContentProps<TAsChild>;
	type $$Slots = DialogContentSlots<TAsChild>;

	// TODO #41 Remove unnecessary store overhead for each option.
	export let onOpenAutoFocus: ((ev: Event) => void) | undefined = undefined;
	const onOpenAutoFocusStore = writable(onOpenAutoFocus);
	const watchOnOpenAutoFocus = bindStore(
		onOpenAutoFocusStore,
		(o) => (onOpenAutoFocus = o),
	);
	$: watchOnOpenAutoFocus(onOpenAutoFocus);
	export let onCloseAutoFocus: ((ev: Event) => void) | undefined = undefined;
	const onCloseAutoFocusStore = writable(onCloseAutoFocus);
	const watchOnCloseAutoFocus = bindStore(
		onCloseAutoFocusStore,
		(o) => (onCloseAutoFocus = o),
	);
	$: watchOnCloseAutoFocus(onCloseAutoFocus);
	export let onEscapeKeyDown: ((ev: KeyboardEvent) => void) | undefined =
		undefined;
	const onEscapeKeyDownStore = writable(onEscapeKeyDown);
	const watchOnEscapeKeyDown = bindStore(
		onEscapeKeyDownStore,
		(o) => (onEscapeKeyDown = o),
	);
	$: watchOnEscapeKeyDown(onEscapeKeyDown);
	export let onInteractOutside:
		| ((ev: MouseEvent | TouchEvent) => void)
		| undefined = undefined;
	const onInteractOutsideStore = writable(onInteractOutside);
	const watchOnInteractOutside = bindStore(
		onInteractOutsideStore,
		(o) => (onInteractOutside = o),
	);
	$: watchOnInteractOutside(onInteractOutside);

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Content/> must be a child of `<Dialog.Root/>`');
	}
	export let forceMount: boolean | undefined = undefined;
	const component = rootModel.registerComponent(
		new DialogContentModel(rootModel, {forceMount}),
	);
	const id = component.getId();

	const state = writable(component.initialState);
	component.requestStateUpdate = (updater) => {
		if (updater instanceof Function) {
			state.update(updater);
		} else {
			state.set(updater);
		}
	};
	// TODO #44 Reduce syncing boilerplate.
	createSyncedOption({
		option: onOpenAutoFocusStore,
		onOptionChange: (onOpenAutoFocus) =>
			state.update((prevState) => ({...prevState, onOpenAutoFocus})),
	});
	createSyncedOption({
		option: onCloseAutoFocusStore,
		onOptionChange: (onCloseAutoFocus) =>
			state.update((prevState) => ({...prevState, onCloseAutoFocus})),
	});
	createSyncedOption({
		option: onEscapeKeyDownStore,
		onOptionChange: (onEscapeKeyDown) =>
			state.update((prevState) => ({...prevState, onEscapeKeyDown})),
	});
	createSyncedOption({
		option: onInteractOutsideStore,
		onOptionChange: (onInteractOutside) =>
			state.update((prevState) => ({...prevState, onInteractOutside})),
	});
	$: component.setState($state);

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

	const eventForwarder = createEventForwarder(get_current_component());
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
