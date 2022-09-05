import type {Axis} from './types';

function isTextArea(node: Element) {
	return node.tagName === 'TEXTAREA';
}

function canBeScrolled(node: Element, overflow: 'overflowX' | 'overflowY') {
	const styles = getComputedStyle(node);
	return (
		// Not not scrollable.
		styles[overflow] !== 'hidden' &&
		// Contains scroll inside itself.
		(styles.overflowY === styles.overflowX ||
			styles[overflow] === 'visible' ||
			// `textarea` will always _contain_ scroll inside itself. It can only be hidden.
			!isTextArea(node))
	);
}
function canBeScrolledVertically(node: Element) {
	return canBeScrolled(node, 'overflowY');
}
function canBeScrolledHorizontally(node: Element) {
	return canBeScrolled(node, 'overflowX');
}
function canBeScrolledOnAxis(node: Element, axis: Axis) {
	return axis === 'v'
		? canBeScrolledVertically(node)
		: canBeScrolledHorizontally(node);
}

type ScrollVariables = [position: number, scroll: number, capacity: number];
function getVerticalScrollVariables({
	scrollTop,
	scrollHeight,
	clientHeight,
}: Element): ScrollVariables {
	return [scrollTop, scrollHeight, clientHeight];
}
function getHorizontalScrollVariables({
	scrollLeft,
	scrollWidth,
	clientWidth,
}: Element): ScrollVariables {
	return [scrollLeft, scrollWidth, clientWidth];
}
function getScrollVariablesOnAxis(node: Element, axis: Axis): ScrollVariables {
	return axis === 'v'
		? getVerticalScrollVariables(node)
		: getHorizontalScrollVariables(node);
}

export function canLocationBeScrolled(node: Element, axis: Axis) {
	let current: Element | null = node;

	do {
		// Skip over shadow roots.
		if (typeof ShadowRoot !== 'undefined' && current instanceof ShadowRoot) {
			current = current.host as HTMLElement;
		}
		if (canBeScrolledOnAxis(current, axis)) {
			const [, scroll, capacity] = getScrollVariablesOnAxis(current, axis);
			if (scroll > capacity) {
				return true;
			}
		}
		current = current.parentNode as Element | null;
	} while (current !== null && current !== document.body);

	return false;
}

function getDirectionFactor(axis: Axis, direction: string | null) {
	/**
	 * If the element's direction is rtl (right-to-left), then scrollLeft is 0
	 * when the scrollbar is at its rightmost position, and then increasingly
	 * negative as you scroll towards the end of the content.
	 *
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollLeft
	 */
	return axis === 'h' && direction === 'rtl' ? -1 : 1;
}

export interface ShouldPreventScrollOptions {
	axis: Axis;
	endTarget: Element;
	event: Event;
	noOverscroll: boolean;
	sourceDelta: number;
}

export function shouldPreventScroll({
	axis,
	endTarget,
	event,
	noOverscroll,
	sourceDelta,
}: ShouldPreventScrollOptions) {
	const directionFactor = getDirectionFactor(
		axis,
		window.getComputedStyle(endTarget).direction,
	);
	const delta = directionFactor * sourceDelta;

	let target = event.target as Element | null;
	if (target === null) {
		return false;
	}
	const targetInLock = endTarget.contains(target);

	let cancelScroll = false;
	let availableScroll = 0;
	let availableScrollTop = 0;
	do {
		const [position, scroll, capacity] = getScrollVariablesOnAxis(
			target!,
			axis,
		);

		const elementScroll = scroll - capacity - directionFactor * position;

		if (
			(position !== 0 || elementScroll !== 0) &&
			canBeScrolledOnAxis(target!, axis)
		) {
			availableScroll += elementScroll;
			availableScrollTop += position;
		}

		target = target!.parentNode as Element | null;
	} while (
		// Portalled content.
		(!targetInLock && target !== document.body) ||
		// Self content.
		(targetInLock && (endTarget.contains(target) || endTarget === target))
	);

	if (
		delta > 0 &&
		((noOverscroll && availableScroll === 0) ||
			(!noOverscroll && delta > availableScroll))
	) {
		cancelScroll = true;
	} else if (
		delta <= 0 &&
		((noOverscroll && availableScrollTop === 0) ||
			(!noOverscroll && -delta > availableScrollTop))
	) {
		cancelScroll = true;
	}

	return cancelScroll;
}
