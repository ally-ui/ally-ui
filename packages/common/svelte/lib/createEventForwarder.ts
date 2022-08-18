import type {SvelteComponent} from 'svelte';
import {
	bubble,
	listen,
	prevent_default,
	stop_propagation,
} from 'svelte/internal';

type ForwardException = string | {name: string; shouldExclude: () => boolean};
type EventHandler = (ev: any) => void;
type Cleanup = () => void;
interface EventOptions {
	passive?: true;
	nonpassive?: true;
	capture?: true;
	once?: true;
	preventDefault?: true;
	stopPropagation?: true;
}

interface CreateEventForwarderOptions {
	except?: ForwardException[];
}

// CREDIT https://github.com/rgossiaux/svelte-headlessui/blob/master/src/lib/internal/forwardEventsBuilder.ts
export default function createEventForwarder(
	component: SvelteComponent,
	{except = []}: CreateEventForwarderOptions = {},
) {
	// `$on` is defined on component mount.
	let $on: (eventType: string, handler: EventHandler) => Cleanup | undefined;
	const eventsBeforeMount: [string, EventHandler][] = [];

	// Override the $on function to forward all bound events.
	component.$on = (eventType, handler) => {
		let cleanup: Cleanup | undefined;
		for (const exception of except) {
			if (typeof exception === 'string' && eventType === exception) {
				// Bail out of forwarding the event and defer to the original Svelte $on() behavior.
				if (component.$$.callbacks[eventType] === undefined) {
					component.$$.callbacks[eventType] = [];
				}
				const callbacks = component.$$.callbacks[eventType];
				callbacks.push(handler);
				return () => {
					const idx = callbacks.indexOf(handler);
					if (idx !== -1) {
						callbacks.splice(idx, 1);
					}
				};
			}
			if (typeof exception === 'object' && exception.name === eventType) {
				handler = (ev) => {
					if (typeof exception !== 'object' || !exception.shouldExclude()) {
						handler(ev);
					}
				};
			}
		}
		if ($on !== undefined) {
			// The event was bound programmatically.
			cleanup = $on(eventType, handler);
		} else {
			// The event was bound before mount by Svelte.
			eventsBeforeMount.push([eventType, handler]);
		}
		return () => {
			cleanup?.();
		};
	};

	function forward(ev: Event) {
		// Internally bubble the event up from the Svelte component.
		bubble(component, ev);
	}

	return (node: Element) => {
		const cleanups: Cleanup[] = [];
		const forwardCleanups: Record<string, Cleanup> = {};

		// Responsible for listening and forwarding all bound events.
		$on = (eventTypeWithModifiers, originalHandler) => {
			const {eventType, handler, options} = getListenerOptions(
				eventTypeWithModifiers,
				originalHandler,
			);

			const stopListener = listen(node, eventType, handler, options);

			const cleanup = () => {
				stopListener();
				const idx = cleanups.indexOf(cleanup);
				if (idx !== -1) {
					cleanups.splice(idx, 1);
				}
			};
			cleanups.push(cleanup);

			// Forward the event from Svelte.
			if (forwardCleanups[eventType] === undefined) {
				forwardCleanups[eventType] = listen(node, eventType, forward);
			}

			return cleanup;
		};

		// Listen to all events added before mount.
		eventsBeforeMount.forEach(([eventType, handler]) => {
			$on(eventType, handler);
		});

		return {
			destroy() {
				// Remove all event listeners.
				cleanups.forEach((cleanup) => {
					cleanup();
				});

				// Remove all event forwarders.
				Object.values(forwardCleanups).forEach((cleanup) => {
					cleanup();
				});
			},
		};
	};
}

const MODIFIER_DIVIDER = '!';
const MODIFIER_REGEX = new RegExp(
	`^[^${MODIFIER_DIVIDER}]+(?:${MODIFIER_DIVIDER}(?:preventDefault|stopPropagation|passive|nonpassive|capture|once|self))+$`,
);

interface ListenerOptions {
	eventType: string;
	handler: EventHandler;
	options?: AddEventListenerOptions;
}
function getListenerOptions(
	eventTypeWithModifiers: string,
	handler: EventHandler,
): ListenerOptions {
	// DOM addEventListener options
	let options: AddEventListenerOptions | undefined;
	const modifierMatch = eventTypeWithModifiers.match(MODIFIER_REGEX);
	let eventType = eventTypeWithModifiers;
	// Parse event modifiers.
	if (modifierMatch !== null) {
		const [extractedEventType, ...modifiers] =
			eventTypeWithModifiers.split(MODIFIER_DIVIDER);
		eventType = extractedEventType;
		const eventOptions: EventOptions = Object.fromEntries(
			modifiers.map((mod) => [mod, true]),
		);
		if (eventOptions.passive) {
			options = options ?? {};
			options.passive = true;
		}
		if (eventOptions.nonpassive) {
			options = options ?? {};
			options.passive = false;
		}
		if (eventOptions.capture) {
			options = options ?? {};
			options.capture = true;
		}
		if (eventOptions.once) {
			options = options ?? {};
			options.once = true;
		}
		if (eventOptions.preventDefault) {
			handler = prevent_default(handler);
		}
		if (eventOptions.stopPropagation) {
			handler = stop_propagation(handler);
		}
	}
	return {
		eventType,
		handler,
		options,
	};
}
