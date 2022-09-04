import {get_current_component} from 'svelte/internal';

type NativeEventDispatcher<TEventMap extends Record<string, Event>> = <
	TEventKey extends Extract<keyof TEventMap, string>,
>(
	type: TEventKey,
	event: TEventMap[TEventKey],
) => void;

export function createNativeEventDispatcher<
	TEventMap extends Record<string, Event> = any,
>(): NativeEventDispatcher<TEventMap> {
	const component = get_current_component();
	return (type, event) => {
		const callbacks: ((event: TEventMap[typeof type]) => void)[] =
			component.$$.callbacks[type];
		callbacks?.forEach((callback) => callback(event));
	};
}
