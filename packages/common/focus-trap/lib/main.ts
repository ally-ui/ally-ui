import {StatefulModel} from '@ally-ui/core';

function isEscapeEvent(ev: KeyboardEvent) {
	return ev.key === 'Escape' || ev.key === 'Esc';
}

function isTabEvent(ev: KeyboardEvent) {
	return ev.key === 'Tab';
}

function isHTMLElement(el: Element): el is HTMLElement {
	return el instanceof HTMLElement;
}

function isTargetContainedBy(target: EventTarget | null, container: Element) {
	return target instanceof Node && container.contains(target);
}

function isValueOrHandler<TValue>(
	valueOrHandler: boolean | ((value: TValue) => boolean),
	value: TValue,
) {
	if (typeof valueOrHandler === 'function') {
		return valueOrHandler(value);
	}
	return valueOrHandler;
}

/**
 * Check if a mutation may result in the list of focusable children in the DOM to update
 * @param mutation A DOM mutation observer record
 * @returns If the mutation may update the list of focusable children in the DOM
 */
function mutationUpdatesFocusableChildren(mutation: MutationRecord) {
	if (mutation.type === 'childList') {
		return true;
	}
	if (mutation.type === 'attributes' && mutation.attributeName === 'tabindex') {
		return true;
	}
	return false;
}

const LISTENER_OPTIONS: AddEventListenerOptions = {
	capture: true,
	passive: false,
};

const FOCUSABLE_SELECTORS = [
	'input:not(:disabled)',
	'select:not(:disabled)',
	'textarea:not(:disabled)',
	'button:not(:disabled)',
	'[href]',
	'[tabindex]:not([tabindex="-1"])',
];

/**
 * Adapted from https://github.com/focus-trap/focus-trap

 * If the trap is inside a shadow DOM, `event.target` will always be the shadow
 * host. However, `event.target.composedPath()` will be an array of nodes
 * "clicked" from inner-most (the actual element inside the shadow) to
 * outer-most (the host HTML document). If we have access to `composedPath()`,
 * then use its first element; otherwise, fall back to `event.target` (and this
 * only works for an _open_ shadow DOM; otherwise, `composedPath()[0] ===
 * event.target` always).

 * @param ev The event to find the target of
 * @returns The target of the event
 */
function getActualTarget(ev: Event) {
	return ev.target instanceof Element &&
		ev.target.shadowRoot &&
		typeof ev.composedPath === 'function'
		? ev.composedPath()[0]
		: ev.target;
}

export interface FocusTrapOptions {
	container: HTMLElement;
	active?: boolean;
	clickOutsideDeactivates?: boolean | ((ev: MouseEvent) => boolean);
	escapeDeactivates?: boolean | ((ev: KeyboardEvent) => boolean);
	returnFocusTo?: HTMLElement;
}

export interface FocusTrapState {
	active: boolean;
}

export class FocusTrapModel extends StatefulModel<
	FocusTrapOptions,
	FocusTrapState
> {
	constructor(id: string, initialOptions: FocusTrapOptions) {
		super(id, initialOptions);
		if (this.getState().active) {
			this.activate();
		}
	}

	deriveInitialState(options: FocusTrapOptions): FocusTrapState {
		return {
			active: options.active ?? false,
		};
	}

	watchStateChange(newState: FocusTrapState, oldState: FocusTrapState) {
		if (newState.active !== oldState.active) {
			this.#onActiveChangeEffect(newState.active);
		}
	}

	#onActiveChangeEffect(active: boolean) {
		if (active) {
			this.activate();
		} else {
			this.deactivate();
		}
	}

	#focusableChildren: HTMLElement[] = [];
	#unsubscribeChildren?: () => void;
	#watchChildren() {
		if (this.#unsubscribeChildren !== undefined) {
			return;
		}
		const update = () => {
			this.#focusableChildren = Array.from(
				this.options.container.querySelectorAll(FOCUSABLE_SELECTORS.join(',')),
			).filter(isHTMLElement);
		};
		update();

		const observer = new MutationObserver((mutationList) => {
			if (mutationList.some(mutationUpdatesFocusableChildren)) {
				update();
			}
		});

		observer.observe(this.options.container, {
			attributes: true,
			childList: true,
			subtree: true,
		});

		this.#unsubscribeChildren = () => {
			observer.disconnect();
			this.#unsubscribeChildren = undefined;
		};
	}

	#unsubscribeEvents?: () => void;
	#watchEvents() {
		if (this.#unsubscribeEvents !== undefined) {
			return;
		}
		this.options.container.addEventListener(
			'keydown',
			this.#handleKey,
			LISTENER_OPTIONS,
		);
		window.addEventListener(
			'mousedown',
			this.#handlePointerDown,
			LISTENER_OPTIONS,
		);
		window.addEventListener('touchstart', this.#handleTouch, LISTENER_OPTIONS);
		window.addEventListener('click', this.#handleClick, LISTENER_OPTIONS);

		this.#unsubscribeEvents = () => {
			this.options.container.removeEventListener(
				'keydown',
				this.#handleKey,
				LISTENER_OPTIONS,
			);
			window.removeEventListener(
				'mousedown',
				this.#handlePointerDown,
				LISTENER_OPTIONS,
			);
			window.removeEventListener(
				'touchstart',
				this.#handleTouch,
				LISTENER_OPTIONS,
			);
			window.removeEventListener('click', this.#handleClick, LISTENER_OPTIONS);
			this.#unsubscribeEvents = undefined;
		};
	}

	#returnFocus?: () => void;
	#previouslyFocused?: Element;
	#trapFocus() {
		if (this.#returnFocus !== undefined) {
			return;
		}
		this.#previouslyFocused = document.activeElement ?? undefined;
		this.#focusableChildren.at(0)?.focus();
		this.#returnFocus = () => {
			const toElement = this.options.returnFocusTo ?? this.#previouslyFocused;
			if (toElement instanceof HTMLElement) {
				toElement.focus();
			}
			this.#returnFocus = undefined;
		};
	}

	#handleKey = (ev: KeyboardEvent) => {
		if (isEscapeEvent(ev)) {
			this.#handleEsc(ev);
			return;
		}
		if (isTabEvent(ev)) {
			this.#handleTab(ev);
			return;
		}
	};

	#handleEsc = (ev: KeyboardEvent) => {
		if (isValueOrHandler(this.options.escapeDeactivates ?? true, ev)) {
			ev.preventDefault();
			this.deactivate();
		}
	};

	#handleTab = (ev: KeyboardEvent) => {
		const firstFocusable = this.#focusableChildren.at(0);
		const lastFocusable = this.#focusableChildren.at(-1);
		const target = getActualTarget(ev);
		if (ev.shiftKey) {
			if (target === firstFocusable) {
				ev.preventDefault();
				lastFocusable?.focus();
			}
		} else {
			if (target === lastFocusable) {
				ev.preventDefault();
				firstFocusable?.focus();
			}
		}
	};

	#handlePointerDown = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.options.container)) {
			return;
		}
		ev.preventDefault();
		if (isValueOrHandler(this.options.clickOutsideDeactivates ?? false, ev)) {
			this.deactivate();
		}
	};

	#handleTouch = (ev: TouchEvent) => {
		// Treat the touch as a regular pointer.
		if (ev.touches.length === 1) {
			this.#handleSingleTouch(ev);
			return;
		}
		// Allow for touch gestures that spill out of the container element.
		const touches = Array.from(ev.touches);
		if (
			touches.some((t) => isTargetContainedBy(t.target, this.options.container))
		) {
			return;
		}
		ev.preventDefault();
	};

	#handleSingleTouch = (ev: TouchEvent) => {
		const touch = ev.touches.item(0)!;
		if (isTargetContainedBy(touch.target, this.options.container)) {
			return;
		}
		ev.preventDefault();
		return;
	};

	#handleClick = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.options.container)) {
			return;
		}
		if (isValueOrHandler(this.options.clickOutsideDeactivates ?? false, ev)) {
			return;
		}
		ev.preventDefault();
		ev.stopImmediatePropagation();
	};

	activate() {
		this.#watchChildren();
		this.#watchEvents();
		this.#trapFocus();
		if (!this.getState().active) {
			this.options.onStateChange?.((oldState) => ({
				...oldState,
				active: true,
			}));
		}
	}

	deactivate() {
		this.#unsubscribeChildren?.();
		this.#unsubscribeEvents?.();
		this.#returnFocus?.();
		if (this.getState().active) {
			this.options.onStateChange?.((oldState) => ({
				...oldState,
				active: false,
			}));
		}
	}
}
