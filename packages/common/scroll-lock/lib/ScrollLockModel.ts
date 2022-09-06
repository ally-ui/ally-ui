import {StateModel} from '@ally-ui/core';
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

export interface ScrollLockOptions {
	/**
	 * The only element allowed to scroll.
	 */
	container: HTMLElement;
	/**
	 * Whether the scroll lock should initially be active.
	 */
	initialActive?: boolean;
	/**
	 * Whether pinch zoom should be allowed on touchscreen devices.
	 *
	 * Defaults to `false`.
	 */
	allowPinchZoom?: boolean;
}

export interface ScrollLockReactive {
	active: boolean;
}

export type ScrollLockState = ScrollLockOptions & ScrollLockReactive;

export class ScrollLockModel extends StateModel<ScrollLockState> {
	static SUPPORTS_OVERSCROLL_BEHAVIOR =
		typeof document !== 'undefined' &&
		CSS.supports('overscroll-behavior', 'contain');

	/**
	 * Keep track of all active locks and only handle the latest lock.
	 */
	static activeLocks: ScrollLockModel[] = [];

	constructor(initialOptions: ScrollLockOptions) {
		super({...initialOptions, active: initialOptions.initialActive ?? false});
		if (this.state.active) {
			this.activate();
		}
	}

	watchStateChange({active}: ScrollLockState, prev: ScrollLockState) {
		if (active !== prev.active) {
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

	#unregisterLock?: () => void;
	#registerLock() {
		if (this.#unregisterLock !== undefined) {
			return;
		}
		ScrollLockModel.activeLocks.push(this);
		this.#unregisterLock = () => {
			const idx = ScrollLockModel.activeLocks.findIndex(
				(lock) => lock === this,
			);
			ScrollLockModel.activeLocks.splice(idx, 1);
			this.#unregisterLock = undefined;
		};
	}

	#unblockOverscroll?: () => void;
	#blockOverscroll() {
		if (this.#unblockOverscroll !== undefined) {
			return;
		}
		const {container} = this.state;
		const previous = container.style.overscrollBehavior;
		container.style.overscrollBehavior = 'contain';
		this.#unblockOverscroll = () => {
			container.style.overscrollBehavior = previous;
			this.#unblockOverscroll = undefined;
		};
	}

	#unsubscribeEvents?: () => void;
	#subscribeEvents() {
		if (this.#unsubscribeEvents !== undefined) {
			return;
		}
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
		if (!ev.cancelable) {
			return;
		}
		if (ScrollLockModel.activeLocks.at(-1) !== this) {
			return;
		}
		const {target} = ev;
		if (target instanceof Element && !this.state.container.contains(target)) {
			ev.preventDefault();
		}
		// if (ScrollLockModel.SUPPORTS_OVERSCROLL_BEHAVIOR) {
		// 	return;
		// }
		if (this.#shouldPrevent(ev)) {
			ev.preventDefault();
		}
	};

	#shouldPrevent(ev: WheelEvent | TouchEvent) {
		if (isTouchEvent(ev) && ev.touches.length === 2) {
			return !(this.state.allowPinchZoom ?? false);
		}

		if (isTouchEvent(ev) && this.#overscrolled) {
			return true;
		}

		const delta = this.#getDelta(ev);
		const moveAxis = getDeltaAxis(delta);
		const target = ev.target;
		if (!(target instanceof Element)) {
			return false;
		}

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

		if (!canBeScrolledInMainDirection) {
			return true;
		}

		const prevent = shouldPreventScroll(ev, {
			axis: moveAxis,
			endTarget: this.state.container,
			delta: moveAxis === 'h' ? delta[0] : delta[1],
			overscroll: false,
		});

		if (isTouchEvent(ev) && prevent) {
			this.#overscrolled = true;
		}

		return prevent;
	}

	#getDelta = (ev: WheelEvent | TouchEvent): Coord => {
		if (!isTouchEvent(ev)) {
			return getWheelDelta(ev);
		}
		const [x, y] = getTouchCoord(ev);
		const [prevX, prevY] = this.#prevCoord;
		this.#prevCoord = [x, y];
		return [prevX - x, prevY - y];
	};

	activate() {
		this.#registerLock();
		this.#blockOverscroll();
		this.#subscribeEvents();
		if (!this.state.active) {
			this.requestStateUpdate?.((prevState) => ({...prevState, active: true}));
		}
	}

	deactivate() {
		this.#unregisterLock?.();
		this.#unblockOverscroll?.();
		this.#unsubscribeEvents?.();
		if (this.state.active) {
			this.requestStateUpdate?.((prevState) => ({...prevState, active: false}));
		}
	}
}
