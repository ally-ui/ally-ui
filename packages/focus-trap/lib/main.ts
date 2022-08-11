import {
	isObservable,
	MaybeObservable,
	TWritable,
	writable,
} from '@ally-ui/observable';

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
 * Save the currently focused element and provide a function to return focus to that element.
 * @returns A function to return focus to the previously saved focused element.
 */
function saveCurrentFocus() {
	const savedFocus = document.activeElement;
	return () => {
		if (!(savedFocus instanceof HTMLElement)) {
			return;
		}
		savedFocus.focus();
	};
}

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
	clickOutsideDeactivates?: boolean | ((ev: MouseEvent) => boolean);
	escapeDeactivates?: boolean | ((ev: KeyboardEvent) => boolean);
	onDeactivate?: () => void;
}

export interface FocusTrapState {
	active: boolean;
}

export class FocusTrap {
	state: TWritable<FocusTrapState>;
	#container: HTMLElement;
	#optionsObservable: MaybeObservable<FocusTrapOptions>;

	constructor(
		container: HTMLElement,
		options: MaybeObservable<FocusTrapOptions> = {},
	) {
		this.state = writable<FocusTrapState>({
			active: false,
		});
		this.#container = container;
		this.#optionsObservable = options;
	}

	#options: FocusTrapOptions = {};
	#unsubscribeOptions?: () => void;
	watchOptions() {
		this.#unsubscribeOptions?.();
		if (isObservable(this.#optionsObservable)) {
			const unsubscribeOptions = this.#optionsObservable.subscribe(
				($options) => (this.#options = $options),
			);
			this.#unsubscribeOptions = () => {
				unsubscribeOptions();
				this.#unsubscribeOptions = undefined;
			};
		} else {
			this.#options = this.#optionsObservable;
		}
	}

	#focusableChildren: HTMLElement[] = [];
	#unsubscribeChildren?: () => void;
	watchChildren() {
		this.#unsubscribeChildren?.();
		const update = () => {
			this.#focusableChildren = Array.from(
				this.#container.querySelectorAll(FOCUSABLE_SELECTORS.join(',')),
			).filter(isHTMLElement);
		};
		update();

		const observer = new MutationObserver((mutationList) => {
			if (mutationList.some(mutationUpdatesFocusableChildren)) {
				update();
			}
		});

		observer.observe(this.#container, {
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
	watchEvents() {
		this.#unsubscribeEvents?.();
		this.#container.addEventListener(
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
			this.#container.removeEventListener(
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
		if (isValueOrHandler(this.#options.escapeDeactivates ?? true, ev)) {
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
		if (isTargetContainedBy(getActualTarget(ev), this.#container)) {
			return;
		}
		ev.preventDefault();
		if (isValueOrHandler(this.#options.clickOutsideDeactivates ?? false, ev)) {
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
		if (touches.some((t) => isTargetContainedBy(t.target, this.#container))) {
			return;
		}
		ev.preventDefault();
	};

	#handleSingleTouch = (ev: TouchEvent) => {
		const touch = ev.touches.item(0)!;
		if (isTargetContainedBy(touch.target, this.#container)) {
			return;
		}
		ev.preventDefault();
		return;
	};

	#handleClick = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.#container)) {
			return;
		}
		if (isValueOrHandler(this.#options.clickOutsideDeactivates ?? false, ev)) {
			return;
		}
		ev.preventDefault();
		ev.stopImmediatePropagation();
	};

	#returnFocus?: () => void;
	activate() {
		this.watchOptions();
		this.watchChildren();
		this.watchEvents();
		this.#returnFocus = saveCurrentFocus();
		this.#focusableChildren.at(0)?.focus();
		this.state.update(($state) => ({
			...$state,
			active: true,
		}));
	}

	deactivate() {
		this.#unsubscribeOptions?.();
		this.#unsubscribeChildren?.();
		this.#unsubscribeEvents?.();
		this.#returnFocus?.();
		this.state.update(($state) => ({
			...$state,
			active: false,
		}));
		this.#options.onDeactivate?.();
	}
}

/**
 * Trap focus within an element by handling key presses and pointer events.
 * @param container The container element to trap focus within
 * @param options Static or dynamic options for the focus trap
 * @returns A FocusTrap instance
 */
export function trapFocus(
	container: HTMLElement,
	options: MaybeObservable<FocusTrapOptions> = {},
): FocusTrap {
	const trap = new FocusTrap(container, options);
	trap.activate();
	return trap;
}
