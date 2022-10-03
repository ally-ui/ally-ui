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
			svelteHTML.IntrinsicElements['button'],
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
		mergeSvelteProps,
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
	if (rootModel == null) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogTriggerModel({}, rootModel);

	const rootState = getDialogRootState() ?? readable(rootModel.state);

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
				svelteProps(component.attributes($rootState)),
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
		{...mergeSvelteProps(
			svelteProps(component.attributes($rootState)),
			$$restProps,
		)}
		use:eventForwarder
		on:click={handleClick}
	>
		<slot {...slotProps} />
	</button>
{/if}
