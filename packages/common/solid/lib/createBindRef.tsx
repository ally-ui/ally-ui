import {Accessor, createEffect, onCleanup} from 'solid-js';

type CallbackRef<TInstance> = (instance: TInstance) => void;

/**
 * Create a ref to more easily bind and unbind DOM nodes.
 * @param ref The callback ref to call.
 * @param condition An optional boolean accessor to null the ref if false.
 * @returns A ref that passes null on cleanup and if the condition is false.
 */
export function createBindRef(
	ref: CallbackRef<HTMLElement | null>,
	condition?: Accessor<boolean>,
) {
	onCleanup(() => {
		ref(null);
	});
	if (condition !== undefined) {
		createEffect(() => {
			if (!condition()) {
				ref(null);
			}
		});
	}
	return (node: HTMLElement) => {
		ref(node);
	};
}
