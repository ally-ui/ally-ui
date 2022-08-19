import matchers from '@testing-library/jest-dom/matchers';
import {expect} from 'vitest';

expect.extend(matchers);
expect.extend({
	toHaveFocusWithin(element: unknown) {
		if (!(element instanceof HTMLElement || element instanceof SVGElement)) {
			return {
				pass: false,
				message: () => `Expected ${element} to be an HTMLElement or SVGElement`,
			};
		}
		const hasFocusWithin = element.contains(
			element.ownerDocument.activeElement,
		);
		if (hasFocusWithin) {
			return {
				pass: true,
				message: () => `Expected ${element} not to have focus within`,
			};
		} else {
			return {
				pass: false,
				message: () => `Expected ${element} to have focus within`,
			};
		}
	},
});
