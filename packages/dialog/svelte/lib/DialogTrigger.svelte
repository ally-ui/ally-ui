<script lang="ts" context="module">
	export type DialogTriggerProps<TAsChild extends true | undefined> =
		svelteHTML.IntrinsicElements['button'] & {
			node?: HTMLButtonElement | undefined | null;
			asChild?: TAsChild;
		};
</script>

<script lang="ts">
	import {
		DialogTriggerModel,
		type DialogTriggerModelAttributes,
	} from '@ally-ui/core-dialog';
	import {
		createEventForwarder,
		createEventHandlerAction,
		type EventHandlerAction,
	} from '@ally-ui/svelte';
	import {get_current_component, onMount} from 'svelte/internal';
	import {readable} from 'svelte/store';
	import {getDialogRootModel, getDialogRootState} from './context';

	type TAsChild = $$Generic<true | undefined>;
	type $$Props = DialogTriggerProps<TAsChild>;
	type $$Slots = {
		default: undefined extends TAsChild
			? Record<string, never>
			: {
					props: DialogTriggerModelAttributes;
					events: EventHandlerAction<{
						click: [() => void, undefined];
					}>;
			  };
	};

	const rootModel = getDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Trigger/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTriggerModel(rootModel, {}),
	);
	const id = component.getId();

	const rootState = getDialogRootState() ?? readable(rootModel.getState());

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
		props: component.getAttributes($rootState),
		events,
	} as any; // Workaround to allow conditional slot type.

	const eventForwarder = createEventForwarder(get_current_component());
</script>

{#if asChild}
	<slot {...slotProps} />
{:else}
	<button
		bind:this={node}
		{...component.getAttributes($rootState)}
		{...$$restProps}
		use:eventForwarder
		on:click={handleClick}
	>
		<slot />
	</button>
{/if}
