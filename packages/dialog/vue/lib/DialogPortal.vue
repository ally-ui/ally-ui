<script setup lang="ts">
import {inject, provide, ref} from 'vue';
import {
	DIALOG_ROOT_MODEL,
	DIALOG_ROOT_STATE,
	DIALOG_PORTAL_FORCE_MOUNT,
} from './context';

export type DialogPortalProps = {
	container?: HTMLElement | string;
	forceMount?: boolean;
};
const props = withDefaults(defineProps<DialogPortalProps>(), {
	container: 'body',
	forceMount: undefined,
});

const rootModel = inject(DIALOG_ROOT_MODEL);
if (rootModel === undefined) {
	throw new Error('<Dialog.Portal/> must be a child of `<Dialog.Root/>`');
}

const rootState = inject(DIALOG_ROOT_STATE) ?? ref(rootModel.state);

provide(DIALOG_PORTAL_FORCE_MOUNT, props.forceMount);
</script>

<template>
	<Teleport
		:to="props.container"
		:disabled="!rootState.open"
		v-if="rootState.open"
	>
		<slot />
	</Teleport>
</template>
