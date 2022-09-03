import {StateModel} from '@ally-ui/core';
import {
	getActualTarget,
	isEscapeEvent,
	isHTMLElement,
	isTabEvent,
	isTargetContainedBy,
	mutationUpdatesFocusableChildren,
} from './utils';

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

export interface FocusTrapOptions {
	/**
	 * The container to trap focus within.
	 */
	container: HTMLElement;
	/**
	 * Whether the focus trap should initially be active.
	 *
	 * Defaults to `false`.
	 */
	initialActive?: boolean;
	/**
	 * Whether clicking outside the focus trap container deactivates the trap.
	 *
	 * Pass a handler function to configure when the trap should deactivate based
	 * on each individual mouse click.
	 *
	 * Defaults to `false`.
	 */
	clickOutsideDeactivates?: boolean | ((ev: MouseEvent) => boolean);
	/**
	 * Whether pressing escape deactives the trap.
	 *
	 * Pass a handler function to configure when the trap should deactivate based
	 * on each individual keystroke.
	 *
	 * Defaults to `false`.
	 */
	escapeDeactivates?: boolean | ((ev: KeyboardEvent) => boolean);
	/**
	 * A custom element to return focus to on deactivation.
	 *
	 * Pass a getter function to dynamically get the element to return focus to
	 * on deactivation.
	 *
	 * Defaults to the previously focused element before the trap activated.
	 */
	returnFocusTo?: HTMLElement | (() => HTMLElement | undefined);
	/**
	 * Called when focus moves into the content after opening.
	 */
	onOpenAutoFocus?: () => void;
	/**
	 * Called when focus moves out of the content after closing.
	 */
	onCloseAutoFocus?: () => void;
	/**
	 * Called when the escape key is down.
	 */
	onEscapeKeyDown?: (ev: KeyboardEvent) => void;
	/**
	 * Called when an interaction (mouse or touch) occurs outside of the content.
	 */
	onInteractOutside?: (ev: MouseEvent | TouchEvent) => void;
}

export interface FocusTrapReactive {
	active: boolean;
}

export type FocusTrapState = FocusTrapOptions & FocusTrapReactive;

export class FocusTrapModel extends StateModel<FocusTrapState> {
	constructor(initialOptions: FocusTrapOptions) {
		super({...initialOptions, active: initialOptions.initialActive ?? false});
		if (this.state.active) {
			this.activate();
		}
	}

	watchStateChange({active}: FocusTrapState, prevState: FocusTrapState) {
		if (active !== prevState.active) {
			this.#onActiveChangeEffect(active);
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
				this.state.container.querySelectorAll(FOCUSABLE_SELECTORS.join(',')),
			).filter(isHTMLElement);
		};
		update();

		const observer = new MutationObserver((mutationList) => {
			if (mutationList.some(mutationUpdatesFocusableChildren)) {
				update();
			}
		});

		observer.observe(this.state.container, {
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
		window.addEventListener('keydown', this.#handleKeyDown, LISTENER_OPTIONS);
		window.addEventListener(
			'mousedown',
			this.#handleMouseDown,
			LISTENER_OPTIONS,
		);
		window.addEventListener(
			'touchstart',
			this.#handleTouchStart,
			LISTENER_OPTIONS,
		);
		window.addEventListener('click', this.#handleClick, LISTENER_OPTIONS);

		this.#unsubscribeEvents = () => {
			window.removeEventListener(
				'keydown',
				this.#handleKeyDown,
				LISTENER_OPTIONS,
			);
			window.removeEventListener(
				'mousedown',
				this.#handleMouseDown,
				LISTENER_OPTIONS,
			);
			window.removeEventListener(
				'touchstart',
				this.#handleTouchStart,
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
			const {returnFocusTo} = this.state;
			const elementToReturnFocusTo =
				returnFocusTo instanceof Function ? returnFocusTo() : returnFocusTo;
			const resolvedElement = elementToReturnFocusTo ?? this.#previouslyFocused;
			if (resolvedElement instanceof HTMLElement) {
				resolvedElement.focus();
			}
			this.#returnFocus = undefined;
		};
	}

	#handleKeyDown = (ev: KeyboardEvent) => {
		if (isEscapeEvent(ev)) {
			this.#handleEscapeDown(ev);
			return;
		}
		if (isTabEvent(ev)) {
			this.#handleTabDown(ev);
			return;
		}
	};

	#handleEscapeDown = (ev: KeyboardEvent) => {
		this.state.onEscapeKeyDown?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		this.deactivate();
	};

	#handleTabDown = (ev: KeyboardEvent) => {
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

	#handleMouseDown = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.state.container)) {
			return;
		}
		this.state.onInteractOutside?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		this.deactivate();
	};

	#handleTouchStart = (ev: TouchEvent) => {
		// Treat the touch as a single pointer.
		if (ev.touches.length === 1) {
			this.#handleTouchStart__single(ev);
			return;
		}
		// Ignore touch gestures as long as one touch is within the container element.
		if (
			Array.from(ev.touches).some((t) =>
				isTargetContainedBy(t.target, this.state.container),
			)
		) {
			return;
		}
		ev.preventDefault();
	};

	#handleTouchStart__single = (ev: TouchEvent) => {
		const touch = ev.touches.item(0)!;
		if (isTargetContainedBy(touch.target, this.state.container)) {
			return;
		}
		this.state.onInteractOutside?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		this.deactivate();
	};

	#handleClick = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.state.container)) {
			return;
		}
		if (this.state.active) {
			ev.preventDefault();
		}
	};

	activate() {
		this.#watchChildren();
		this.#watchEvents();
		this.#trapFocus();
		if (!this.state.active) {
			this.requestStateUpdate?.((prevState) => ({
				...prevState,
				active: true,
			}));
		}
	}

	deactivate() {
		this.#unsubscribeChildren?.();
		this.#unsubscribeEvents?.();
		if (this.state.active) {
			this.requestStateUpdate?.((prevState) => ({
				...prevState,
				active: false,
			}));
		}
		this.#returnFocus?.();
	}
}
