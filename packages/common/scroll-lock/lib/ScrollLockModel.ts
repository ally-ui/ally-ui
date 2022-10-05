import {NodeComponentModel} from '@ally-ui/core';
import type {Coord} from './types';
import {
	canLocationBeScrolled,
	getDeltaAxis,
	getTouchCoord,
	getWheelDelta,
	isTouchEvent,
	shouldPreventScroll,
} from './utils';

const LISTENER_OPTIONS: AddEventListenerOptions = {
	capture: true,
	passive: false,
};

export interface ScrollLockModelProps {
	/**
	 * Whether the scroll lock should initially be active.
	 *
	 * Defaults to `false`.
	 */
	initialActive?: boolean;
	/**
	 * The current active state of the scroll lock.
	 *
	 * Defaults to `initialActive`.
	 */
	active?: boolean;
	/**
	 * Whether pinch zoom should be allowed on touchscreen devices.
	 *
	 * Defaults to `false`.
	 */
	allowPinchZoom?: boolean;
}

export interface ScrollLockModelState {
	active: boolean;
	allowPinchZoom: boolean;
}

export interface ScrollLockModelEvents {}

export interface ScrollLockModelAttributes {
	style?: {
		'overscroll-behavior': 'contain';
	};
}

export class ScrollLockModel extends NodeComponentModel<
	ScrollLockModelProps,
	ScrollLockModelState,
	ScrollLockModelEvents,
	ScrollLockModelAttributes
> {
	static SUPPORTS_OVERSCROLL_BEHAVIOR =
		typeof document !== 'undefined' &&
		CSS.supports('overscroll-behavior', 'contain');

	initialState(initialProps: ScrollLockModelProps): ScrollLockModelState {
		return {
			active: initialProps.active ?? initialProps.initialActive ?? false,
			allowPinchZoom: initialProps.allowPinchZoom ?? false,
		};
	}

	#unsubscribeStateChange?: () => void;
	bind(node: HTMLElement) {
		super.bind(node);
		this.#unsubscribeStateChange = this.state.subscribe(this.#onStateChange);
	}

	unbind() {
		super.unbind();
		this.#unsubscribeStateChange?.();
	}

	#onStateChange = (
		{active}: ScrollLockModelProps,
		prev?: ScrollLockModelProps,
	) => {
		if (active !== prev?.active) {
			if (active) {
				this.activate();
			} else {
				this.deactivate();
			}
		}
	};

	attributes(): ScrollLockModelAttributes {
		return {
			style: {'overscroll-behavior': 'contain'},
		};
	}

	activate() {
		this.#registerLock();
		this.#subscribeEvents();
		if (!this.state.value.active) {
			this.state.requestUpdate?.((prev) => ({...prev, active: true}));
		}
	}

	deactivate() {
		this.#deregisterLock?.();
		this.#unsubscribeEvents?.();
		if (this.state.value.active) {
			this.state.requestUpdate?.((prev) => ({...prev, active: false}));
		}
	}

	/**
	 * Keep track of all active locks and only handle the latest lock.
	 */
	static activeLocks: ScrollLockModel[] = [];
	#deregisterLock?: () => void;
	#registerLock() {
		if (this.#deregisterLock != null) return;
		ScrollLockModel.activeLocks.push(this);
		this.#deregisterLock = () => {
			const idx = ScrollLockModel.activeLocks.findIndex(
				(lock) => lock === this,
			);
			ScrollLockModel.activeLocks.splice(idx, 1);
			this.#deregisterLock = undefined;
		};
	}

	#unsubscribeEvents?: () => void;
	#subscribeEvents() {
		if (this.#unsubscribeEvents != null) return;
		window.addEventListener('touchstart', this.#onTouchStart, LISTENER_OPTIONS);
		window.addEventListener('touchend', this.#onTouchEnd, LISTENER_OPTIONS);
		window.addEventListener('wheel', this.#onScroll, LISTENER_OPTIONS);
		window.addEventListener('touchmove', this.#onScroll, LISTENER_OPTIONS);
		// prettier-ignore
		this.#unsubscribeEvents = () => {
			window.removeEventListener('touchstart', this.#onTouchStart, LISTENER_OPTIONS)
			window.removeEventListener('touchend', this.#onTouchEnd, LISTENER_OPTIONS);
			window.removeEventListener('wheel', this.#onScroll, LISTENER_OPTIONS);
			window.removeEventListener('touchmove', this.#onScroll, LISTENER_OPTIONS);
			this.#unsubscribeEvents = undefined;
		};
	}

	#prevCoord: Coord = [0, 0];
	#onTouchStart = (ev: TouchEvent) => {
		this.#prevCoord = getTouchCoord(ev);
	};

	#overscrolled = false;
	#onTouchEnd = () => {
		this.#overscrolled = false;
	};

	#onScroll = (ev: WheelEvent | TouchEvent) => {
		if (!ev.cancelable) return;
		if (ScrollLockModel.activeLocks.at(-1) !== this) return;
		const {node} = this;
		if (node == null) return;
		const {target} = ev;
		if (target instanceof Element && !node.contains(target)) {
			ev.preventDefault();
		}
		if (this.#shouldPrevent(ev)) {
			ev.preventDefault();
		}
	};

	#shouldPrevent(ev: WheelEvent | TouchEvent) {
		const {node} = this;
		if (node == null) return false;

		if (isTouchEvent(ev) && ev.touches.length === 2) {
			return !(this.state.value.allowPinchZoom ?? false);
		}

		if (isTouchEvent(ev) && this.#overscrolled) return true;

		const delta = this.#getDelta(ev);
		const moveAxis = getDeltaAxis(delta);
		const target = ev.target;
		if (!(target instanceof Element)) return false;

		// Horizontal `touchmove` on range inputs does not cause scroll.
		if (
			isTouchEvent(ev) &&
			moveAxis === 'h' &&
			target instanceof HTMLInputElement &&
			target.type === 'range'
		) {
			return false;
		}

		let canBeScrolledInMainDirection = canLocationBeScrolled(target, moveAxis);

		if (!canBeScrolledInMainDirection) return true;

		const prevent = shouldPreventScroll(ev, {
			axis: moveAxis,
			endTarget: node,
			delta: moveAxis === 'h' ? delta[0] : delta[1],
			overscroll: false,
		});

		if (isTouchEvent(ev) && prevent) {
			this.#overscrolled = true;
		}

		return prevent;
	}

	#getDelta(ev: WheelEvent | TouchEvent): Coord {
		if (!isTouchEvent(ev)) {
			return getWheelDelta(ev);
		}
		const [x, y] = getTouchCoord(ev);
		const [prevX, prevY] = this.#prevCoord;
		this.#prevCoord = [x, y];
		return [prevX - x, prevY - y];
	}
}
