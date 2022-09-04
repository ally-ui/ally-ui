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
	 * Called when focus moves into the content after activation.
	 */
	onActivateAutoFocus?: () => void;
	/**
	 * Called when focus moves out of the content after deactivation.
	 */
	onDeactivateAutoFocus?: (ev: Event) => void;
	/**
	 * Called when the escape key is down. It can be prevented by calling
	 * `ev.preventDefault`.
	 */
	onEscapeKeyDown?: (ev: KeyboardEvent) => void;
	/**
	 * Called when an interaction (mouse or touch) occurs outside of the content.
	 * It can be prevented by calling `ev.preventDefault`.
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
		window.addEventListener('keydown', this.#onKeyDown, LISTENER_OPTIONS);
		window.addEventListener('mousedown', this.#onInteract, LISTENER_OPTIONS);
		window.addEventListener('touchstart', this.#onInteract, LISTENER_OPTIONS);
		window.addEventListener('mouseup', this.#onInteractEnd, LISTENER_OPTIONS);
		window.addEventListener('touchend', this.#onInteractEnd, LISTENER_OPTIONS);
		window.addEventListener('click', this.#onClick, LISTENER_OPTIONS);

		// prettier-ignore
		this.#unsubscribeEvents = () => {
			window.removeEventListener('keydown', this.#onKeyDown, LISTENER_OPTIONS);
			window.removeEventListener('mousedown', this.#onInteract, LISTENER_OPTIONS);
			window.removeEventListener('touchstart', this.#onInteract, LISTENER_OPTIONS);
			window.removeEventListener('mouseup', this.#onInteractEnd, LISTENER_OPTIONS);
			window.removeEventListener('touchend', this.#onInteractEnd, LISTENER_OPTIONS);
			window.removeEventListener('click', this.#onClick, LISTENER_OPTIONS);
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
		this.state.onActivateAutoFocus?.();
		this.#returnFocus = () => {
			this.#returnFocus = undefined;
			const focusEvent = new Event('focus');
			this.state.onDeactivateAutoFocus?.(focusEvent);
			if (focusEvent.defaultPrevented) {
				return;
			}
			if (this.#previouslyFocused instanceof HTMLElement) {
				this.#previouslyFocused.focus();
			}
		};
	}

	#onKeyDown = (ev: KeyboardEvent) => {
		if (isEscapeEvent(ev)) {
			this.#onKeyDown__escape(ev);
			return;
		}
		if (isTabEvent(ev)) {
			this.#onKeyDown__tab(ev);
			return;
		}
	};

	#onKeyDown__escape = (ev: KeyboardEvent) => {
		this.state.onEscapeKeyDown?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		this.deactivate();
	};

	#onKeyDown__tab = (ev: KeyboardEvent) => {
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

	#waitingToDeactivate = false;
	/**
	 * Check mouse or touch interactions via `mousedown` or `touchstart`.
	 */
	#onInteract = (ev: MouseEvent | TouchEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.state.container)) {
			return;
		}
		this.state.onInteractOutside?.(ev);
		if (ev.defaultPrevented) {
			this.#waitingToDeactivate = false;
			return;
		}
		this.#waitingToDeactivate = true;
	};

	#onInteractEnd = () => {
		if (this.#waitingToDeactivate) {
			/**
			 * The `click` event is fired after the full click action occurs. If we
			 * deactivate the focus trap synchronously, the click handler will be
			 * removed before it has a chance to call `ev.preventDefault` and
			 * `ev.stopPropagation`.
			 *
			 * Therefore, we have to schedule the deactivation for one tick after
			 * interaction ends.
			 */
			setTimeout(() => {
				this.deactivate();
				this.#waitingToDeactivate = false;
			});
		}
	};

	#onClick = (ev: MouseEvent) => {
		if (isTargetContainedBy(getActualTarget(ev), this.state.container)) {
			return;
		}
		if (this.state.active) {
			ev.preventDefault();
			ev.stopPropagation();
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
		this.#returnFocus?.();
		if (this.state.active) {
			this.requestStateUpdate?.((prevState) => ({
				...prevState,
				active: false,
			}));
		}
	}
}
