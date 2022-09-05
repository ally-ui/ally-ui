import {StateModel} from '@ally-ui/core';
import {canLocationBeScrolled, shouldPreventScroll} from './scrollHandler';
import type {Axis, Coord, QueuedEvent} from './types';
import {coordIsEqual, getTouchCoord, getWheelDelta} from './utils';

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
	/**
	 * Called when scroll events are captured.
	 */
	onScrollCapture?: (ev: WheelEvent | TouchEvent) => void;
	/**
	 * Called when mouse wheel events are captured.
	 */
	onWheelCapture?: (ev: WheelEvent) => void;
	/**
	 * Called when touch move events are captured.
	 */
	onTouchMoveCapture?: (ev: TouchEvent) => void;
}

export interface ScrollLockReactive {
	active: boolean;
}

export type ScrollLockState = ScrollLockOptions & ScrollLockReactive;

// CREDIT https://github.com/theKashey/react-remove-scroll/blob/master/src/handleScroll.ts
export class ScrollLockModel extends StateModel<ScrollLockState> {
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

	#unsubscribeEvents?: () => void;
	#subscribeEvents() {
		if (this.#unsubscribeEvents !== undefined) {
			return;
		}
		const {container} = this.state;
		// prettier-ignore
		{
			window.addEventListener('wheel', this.#onWindowScroll, LISTENER_OPTIONS);
			window.addEventListener('touchmove', this.#onWindowScroll, LISTENER_OPTIONS);
			window.addEventListener('touchstart', this.#onWindowTouchStart, LISTENER_OPTIONS);
			container.addEventListener('wheel', this.#onScroll, LISTENER_OPTIONS);
			container.addEventListener('touchmove', this.#onTouchMove, LISTENER_OPTIONS);
		}
		// prettier-ignore
		this.#unsubscribeEvents = () => {
			window.removeEventListener('wheel', this.#onWindowScroll, LISTENER_OPTIONS);
			window.removeEventListener('touchmove', this.#onWindowScroll, LISTENER_OPTIONS);
			window.removeEventListener('touchstart', this.#onWindowTouchStart, LISTENER_OPTIONS)
			container.removeEventListener('wheel', this.#onScroll, LISTENER_OPTIONS);
			container.removeEventListener('touchmove', this.#onTouchMove, LISTENER_OPTIONS);
			this.#unsubscribeEvents = undefined;
		};
	}

	#onWindowScroll = (ev: WheelEvent | TouchEvent) => {
		if (ScrollLockModel.activeLocks.at(-1) !== this) {
			return;
		}
		const delta =
			ev instanceof WheelEvent ? getWheelDelta(ev) : getTouchCoord(ev);
		const sourceEvent = this.queuedEvents.find(
			(p) =>
				p.name === ev.type &&
				p.target === ev.target &&
				coordIsEqual(p.delta, delta),
		);
		if (sourceEvent !== undefined && sourceEvent.shouldPrevent) {
			ev.preventDefault();
			return;
		}
		if (sourceEvent === undefined) {
			ev.preventDefault();
		}
	};

	touchStart: Coord = [0, 0];
	activeAxis: Axis | undefined = undefined;
	#onWindowTouchStart = (ev: TouchEvent) => {
		this.touchStart = getTouchCoord(ev);
		this.activeAxis = undefined;
	};

	queuedEvents: QueuedEvent[] = [];
	#queueEvent = (ev: QueuedEvent) => {
		this.queuedEvents.push(ev);
		setTimeout(() => {
			const idx = this.queuedEvents.findIndex((e) => e === ev);
			this.queuedEvents.slice(idx);
		});
	};

	#onScroll = (ev: WheelEvent) => {
		this.#queueEvent({
			name: ev.type,
			delta: getWheelDelta(ev),
			target: ev.target as Element,
			shouldPrevent: this.#shouldPrevent(ev),
		});
	};

	#onTouchMove = (ev: TouchEvent) => {
		this.#queueEvent({
			name: ev.type,
			delta: getTouchCoord(ev),
			target: ev.target as Element,
			shouldPrevent: this.#shouldPrevent(ev),
		});
	};

	#shouldPrevent(ev: WheelEvent | TouchEvent) {
		if (ev instanceof TouchEvent && ev.touches.length === 2) {
			return !(this.state.allowPinchZoom ?? false);
		}

		let deltaX: number;
		let deltaY: number;
		if (ev instanceof TouchEvent) {
			const [x, y] = getTouchCoord(ev);
			const [startX, startY] = this.touchStart;
			deltaX = startX - x;
			deltaY = startY - y;
		} else {
			deltaX = ev.deltaX;
			deltaY = ev.deltaY;
		}

		let currentAxis: Axis | undefined;
		const target = ev.target as Element;
		const moveDirection: Axis = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v';

		// Horizontal `touchmove` on range inputs does not cause scroll.
		if (
			ev instanceof TouchEvent &&
			moveDirection === 'h' &&
			target instanceof HTMLInputElement &&
			target.type === 'range'
		) {
			return false;
		}

		let canBeScrolledInMainDirection = canLocationBeScrolled(
			target,
			moveDirection,
		);

		console.log(canBeScrolledInMainDirection);

		if (!canBeScrolledInMainDirection) {
			return true;
		}

		currentAxis = moveDirection;
		if (
			this.activeAxis === undefined &&
			ev instanceof TouchEvent &&
			(deltaX !== 0 || deltaY !== 0)
		) {
			this.activeAxis = currentAxis;
		}

		const cancellingAxis = this.activeAxis ?? currentAxis;

		return shouldPreventScroll({
			axis: cancellingAxis,
			endTarget: this.state.container,
			event: ev,
			sourceDelta: cancellingAxis === 'h' ? deltaX : deltaY,
			noOverscroll: true,
		});
	}

	activate() {
		this.#registerLock();
		this.#subscribeEvents();
		if (!this.state.active) {
			this.requestStateUpdate?.((prevState) => ({...prevState, active: true}));
		}
	}

	deactivate() {
		this.#unregisterLock?.();
		this.#unsubscribeEvents?.();
		if (this.state.active) {
			this.requestStateUpdate?.((prevState) => ({...prevState, active: false}));
		}
	}
}
