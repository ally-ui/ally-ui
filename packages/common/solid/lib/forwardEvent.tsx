import type {JSX} from 'solid-js';

export function forwardEvent<TTarget, TEvent extends Event>(
	ev: TEvent & {
		currentTarget: TTarget;
		target: Element;
	},
	handler?: JSX.EventHandlerUnion<TTarget, TEvent>,
) {
	if (handler instanceof Function) {
		handler(ev);
	} else if (handler !== undefined) {
		handler[0](handler[1], ev);
	}
}
