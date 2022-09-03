export function isEscapeEvent(ev: KeyboardEvent) {
	return ev.key === 'Escape' || ev.key === 'Esc';
}

export function isTabEvent(ev: KeyboardEvent) {
	return ev.key === 'Tab';
}

export function isHTMLElement(el: Element): el is HTMLElement {
	return el instanceof HTMLElement;
}

export function isTargetContainedBy(
	target: EventTarget | null,
	container: Element,
) {
	return target instanceof Node && container.contains(target);
}

export function isValueOrHandler<TValue>(
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
 * @param mutation A DOM mutation observer record.
 * @returns If the mutation may update the list of focusable children in the DOM.
 */
export function mutationUpdatesFocusableChildren(mutation: MutationRecord) {
	if (mutation.type === 'childList') {
		return true;
	}
	if (mutation.type === 'attributes' && mutation.attributeName === 'tabindex') {
		return true;
	}
	return false;
}

// CREDIT https://github.com/focus-trap/focus-trap/blob/master/index.js#L85
/**
 * If the trap is inside a shadow DOM, `event.target` will always be the shadow
 * host. However, `event.target.composedPath()` will be an array of nodes
 * "clicked" from inner-most (the actual element inside the shadow) to
 * outer-most (the host HTML document). If we have access to `composedPath()`,
 * then use its first element; otherwise, fall back to `event.target` (and this
 * only works for an _open_ shadow DOM; otherwise, `composedPath()[0] ===
 * event.target` always).

 * @param ev The event to find the target of.
 * @returns The target of the event.
 */
export function getActualTarget(ev: Event) {
	return ev.target instanceof Element &&
		ev.target.shadowRoot &&
		typeof ev.composedPath === 'function'
		? ev.composedPath()[0]
		: ev.target;
}
