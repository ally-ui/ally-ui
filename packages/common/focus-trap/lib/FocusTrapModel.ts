import {NodeComponentModel} from '@ally-ui/core';
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

export interface FocusTrapModelProps {
	/**
	 * Whether the focus trap should initially be active.
	 *
	 * Defaults to `false`.
	 */
	initialActive?: boolean;
	/**
	 * The current active state of the focus trap.
	 *
	 * Defaults to `initialActive`.
	 */
	active?: boolean;
	/**
	 * Whether interaction outside the container should be inert.
	 */
	modal?: boolean;
}

export interface FocusTrapModelEvents {
	activeChange?: (active: boolean) => void;
	/**
	 * Called when focus moves into the content after activation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	activateAutoFocus?: (ev: Event) => void;
	/**
	 * Called when focus moves out of the content after deactivation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	deactivateAutoFocus?: (ev: Event) => void;
	/**
	 * Called when the escape key is down. It can be prevented by calling
	 * `ev.preventDefault`.
	 */
	escapeKeyDown?: (ev: KeyboardEvent) => void;
	/**
	 * Called when an interaction (mouse or touch) occurs outside of the content.
	 * It can be prevented by calling `ev.preventDefault`.
	 */
	interactOutside?: (ev: MouseEvent | TouchEvent) => void;
}

export interface FocusTrapModelAttributes {
	'aria-modal'?: 'true';
	style?: {
		'pointer-events': 'auto';
	};
}

export class FocusTrapModel extends NodeComponentModel<
	FocusTrapModelProps,
	FocusTrapModelEvents,
	FocusTrapModelAttributes
> {
	constructor(
		initialProps: FocusTrapModelProps,
		initialEvents: FocusTrapModelEvents,
	) {
		if (initialProps.initialActive == null) initialProps.initialActive = false;
		if (initialProps.active == null)
			initialProps.active = initialProps.initialActive;
		super(initialProps, initialEvents);
		this.props.subscribe(this.#onPropChange);
	}

	attributes(props: FocusTrapModelProps): FocusTrapModelAttributes {
		return FocusTrapModel.attributes(props ?? this.props);
	}

	static attributes(props: FocusTrapModelProps): FocusTrapModelAttributes {
		if (props.modal) {
			return {
				'aria-modal': 'true',
				style: {'pointer-events': 'auto'},
			};
		}
		return {};
	}

	#onPropChange = (
		{active}: FocusTrapModelProps,
		prev?: FocusTrapModelProps,
	) => {
		if (active !== prev?.active) {
			if (active) {
				this.activate();
			} else {
				this.deactivate();
			}
		}
	};

	activate() {
		const {node} = this;
		if (node == null) return;
		this.#registerTrap();
		this.#subscribeChildren();
		this.#subscribeEvents();
		this.#trapFocus();
		if (!this.props.value.active) {
			this.props.requestUpdate?.((prev) => ({...prev, active: true}));
		}
	}

	deactivate() {
		this.#deregisterTrap?.();
		this.#unsubscribeChildren?.();
		this.#unsubscribeEvents?.();
		this.#returnFocus?.();
		if (this.props.value.active) {
			this.props.requestUpdate?.((prev) => ({...prev, active: false}));
		}
	}

	/**
	 * Keep track of all active traps and only handle the latest trap.
	 */
	static activeTraps: FocusTrapModel[] = [];
	#deregisterTrap?: () => void;
	#registerTrap() {
		if (this.#deregisterTrap != null) return;
		FocusTrapModel.activeTraps.push(this);
		this.#deregisterTrap = () => {
			const idx = FocusTrapModel.activeTraps.findIndex((trap) => trap === this);
			FocusTrapModel.activeTraps.splice(idx, 1);
			this.#deregisterTrap = undefined;
		};
	}

	#focusableChildren: HTMLElement[] = [];
	#unsubscribeChildren?: () => void;
	#subscribeChildren() {
		const {node} = this;
		if (node == null) return;
		if (this.#unsubscribeChildren != null) return;
		const update = () => {
			this.#focusableChildren = Array.from(
				node.querySelectorAll(FOCUSABLE_SELECTORS.join(',')),
			).filter(isHTMLElement);
		};
		update();

		const observer = new MutationObserver((mutationList) => {
			if (mutationList.some(mutationUpdatesFocusableChildren)) {
				update();
			}
		});

		observer.observe(node, {
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
	#subscribeEvents() {
		if (this.#unsubscribeEvents != null) return;
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

	#onKeyDown = (ev: KeyboardEvent) => {
		if (FocusTrapModel.activeTraps.at(-1) !== this) return;
		if (isEscapeEvent(ev)) {
			this.#onKeyDown__escape(ev);
		} else if (isTabEvent(ev)) {
			this.#onKeyDown__tab(ev);
		}
	};

	#onKeyDown__escape = (ev: KeyboardEvent) => {
		this.events?.value.escapeKeyDown?.(ev);
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

	#interactEndDeactivates = false;
	/**
	 * Check mouse or touch interactions via `mousedown` or `touchstart`.
	 */
	#onInteract = (ev: MouseEvent | TouchEvent) => {
		if (FocusTrapModel.activeTraps.at(-1) !== this) return;
		if (this.node == null) return;
		if (isTargetContainedBy(getActualTarget(ev), this.node)) return;
		this.events?.value.interactOutside?.(ev);
		this.#interactEndDeactivates = !ev.defaultPrevented;
	};

	#onInteractEnd = () => {
		if (this.#interactEndDeactivates) {
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
				this.#interactEndDeactivates = false;
			});
		}
	};

	#onClick = (ev: MouseEvent) => {
		if (FocusTrapModel.activeTraps.at(-1) !== this) return;
		if (this.node == null) return;
		if (isTargetContainedBy(getActualTarget(ev), this.node)) return;
		if (this.props.value.active) {
			ev.preventDefault();
			ev.stopPropagation();
		}
	};

	#returnFocus?: () => void;
	#previouslyFocused?: Element;
	#trapFocus() {
		if (this.#returnFocus != null) return;
		this.#returnFocus = () => {
			this.#returnFocus = undefined;
			const focusEvent = new Event('focus-trap.on-deactivate-auto-focus', {
				cancelable: true,
			});
			this.events?.value.deactivateAutoFocus?.(focusEvent);
			if (focusEvent.defaultPrevented) {
				return;
			}
			if (this.#previouslyFocused instanceof HTMLElement) {
				this.#previouslyFocused.focus();
			}
		};

		this.#previouslyFocused = document.activeElement ?? undefined;
		const focusEvent = new Event('focus-trap.on-activate-auto-focus', {
			cancelable: true,
		});
		this.events?.value.activateAutoFocus?.(focusEvent);
		if (focusEvent.defaultPrevented) return;
		this.#focusableChildren.at(0)?.focus();
	}
}
