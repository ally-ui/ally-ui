import type {Axis, Coord} from './types';

export function coordIsEqual(a: Coord, b: Coord) {
	return a[0] === b[0] && a[1] === b[1];
}

export function getWheelDelta(ev: WheelEvent): Coord {
	return [ev.deltaX, ev.deltaY];
}

export function getTouchCoord(ev: TouchEvent): Coord {
	const touch = ev.changedTouches[0];
	return [touch.clientX, touch.clientY];
}

/**
 * We cannot use `instanceof WheelEvent` or `instanceof TouchEvent` because iOS
 * Safari does not support `WheelEvent` and macOS Safari does not support
 * `TouchEvent`.
 */
export function isTouchEvent(ev: WheelEvent | TouchEvent): ev is TouchEvent {
	return 'touches' in ev;
}

export function getDeltaAxis([x, y]: Coord): Axis {
	return Math.abs(x) > Math.abs(y) ? 'h' : 'v';
}

function isTextArea(node: Element) {
	return node.tagName === 'TEXTAREA';
}

function canBeScrolled(node: Element, axis: Axis) {
	const overflow = axis === 'v' ? 'overflowY' : 'overflowX';
	const styles = getComputedStyle(node);
	if (styles[overflow] === 'hidden') return false;
	if (styles[overflow] === 'visible') return true;
	// Contains scroll within itself.
	if (styles.overflowY === styles.overflowX) return true;
	// `textarea` will always _contain_ scroll inside itself. It can only be hidden.
	if (!isTextArea(node)) return true;
	return false;
}

type ScrollData = [position: number, scroll: number, capacity: number];

function getScrollData(node: Element, axis: Axis): ScrollData {
	if (axis === 'v') {
		return [node.scrollTop, node.scrollHeight, node.clientHeight];
	}
	return [node.scrollLeft, node.scrollWidth, node.clientWidth];
}

export function canLocationBeScrolled(node: Element, axis: Axis) {
	let current: Element | null = node;

	do {
		// Skip over shadow roots.
		if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
			current = current.host as HTMLElement;
		}
		if (canBeScrolled(current, axis)) {
			const [, scroll, capacity] = getScrollData(current, axis);
			if (scroll > capacity) return true;
		}
		current = current.parentNode as Element | null;
	} while (current != null && current !== document.body);

	return false;
}

/**
 * If the element's direction is rtl (right-to-left), then scrollLeft is 0 when
 * the scrollbar is at its rightmost position, and then increasingly negative as
 * you scroll towards the end of the content.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
 */
function getDirectionFactor(axis: Axis, direction: string | null) {
	return axis === 'h' && direction === 'rtl' ? -1 : 1;
}

export interface ShouldPreventScrollOptions {
	axis: Axis;
	endTarget: Element;
	overscroll: boolean;
	delta: number;
}

// CREDIT https://github.com/theKashey/react-remove-scroll/blob/master/src/handleScroll.ts
export function shouldPreventScroll(
	ev: Event,
	{axis, endTarget, overscroll, delta}: ShouldPreventScrollOptions,
) {
	const directionFactor = getDirectionFactor(
		axis,
		window.getComputedStyle(endTarget).direction,
	);
	delta *= directionFactor;

	let availableEnd = 0;
	let availableStart = 0;
	let {target} = ev;
	const isPortalledTarget = !endTarget.contains(target as Node);
	do {
		if (target == null) return false;
		if (!(target instanceof Element)) return false;
		const [position, scroll, capacity] = getScrollData(target, axis);
		const elementScroll = scroll - capacity - directionFactor * position;
		if (
			(position !== 0 || elementScroll !== 0) &&
			canBeScrolled(target, axis)
		) {
			availableEnd += elementScroll;
			availableStart += position;
		}
		target = target.parentNode;
	} while (
		// Portalled content.
		(isPortalledTarget && target !== document.body) ||
		// Self content.
		(!isPortalledTarget &&
			(endTarget.contains(target as Node) || endTarget === target))
	);

	if (delta > 0) {
		if (overscroll) return delta > availableEnd;
		return availableEnd === 0;
	}

	if (delta <= 0) {
		if (overscroll) return -delta > availableStart;
		return availableStart === 0;
	}

	return false;
}
