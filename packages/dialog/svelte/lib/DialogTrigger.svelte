<script lang="ts" context="module">
	type DialogTriggerProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['button'] & {
			node?: HTMLButtonElement | undefined | null;
			asChild?: TAsChild;
		};
	type DialogTriggerSlots<TAsChild extends true | undefined> = {
		default: DefaultSlot<
			TAsChild,
			DialogTriggerModelAttributes,
			RefAction<{
				click: [(ev: Event) => void, undefined];
			}>
		>;
	};
</script>

<script lang="ts">
	import {
		DialogTriggerModel,
		type DialogTriggerModelAttributes,
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
	import {readable} from 'svelte/store';
	import {getDialogRootModel, getDialogRootState} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogTriggerProps<TAsChild>;
	type $$Slots = DialogTriggerSlots<TAsChild>;

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTriggerModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = getDialogRootState() ?? readable(rootModel.state);

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

	function handleClick() {
		component.onClick();
	}

	const ref = createRefAction((n) => (node = n), {
		click: [handleClick, undefined],
	});

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: component.getAttributes($rootState),
		ref,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder();
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		bind:this={node}
		{...mergeSlotProps(
			svelteProps(component.getAttributes($rootState)),
			$$restProps,
		)}
		use:eventForwarder
		on:click={handleClick}
	>
		<slot />
	</button>
{/if}
