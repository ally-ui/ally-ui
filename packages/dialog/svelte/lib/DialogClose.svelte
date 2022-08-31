<script lang="ts" context="module">
	export type DialogCloseProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['button'] & {
			node?: HTMLButtonElement | undefined | null;
			asChild?: TAsChild;
		};
</script>

<script lang="ts">
	import {
		DialogCloseModel,
		type DialogCloseModelAttributes,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createEventHandlerAction,
		type EventHandlerAction,
	} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {getDialogRootModel} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogCloseProps<TAsChild>;
	type $$Slots = {
		default: undefined extends TAsChild
			? Record<string, never>
			: {
					props: DialogCloseModelAttributes;
					events: EventHandlerAction<{
						click: [() => void, undefined];
					}>;
			  };
	};

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Close/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogCloseModel(rootModel, {}),
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

	function handleClick() {
		component.onClick();
	}

	const events = createEventHandlerAction({
		click: [handleClick, undefined],
	});

	export let asChild: TAsChild = undefined as TAsChild;

	$: slotProps = {
		props: component.getAttributes(),
		events,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder(get_current_component());
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		bind:this={node}
		{...component.getAttributes()}
		{...$$restProps}
		use:eventForwarder
		on:click={() => component.onClick()}
	>
		<slot />
	</button>
{/if}
