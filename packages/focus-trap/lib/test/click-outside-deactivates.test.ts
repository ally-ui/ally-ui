import {observable} from '@ally-ui/observable';
import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, expect, it} from 'vitest';
import {FocusTrap, FocusTrapOptions, trapFocus} from '../main';

let trap: FocusTrap | undefined;
beforeEach(() => {
	document.body.innerHTML = `
<button data-testid="outside-1">outside first</button>
<button data-testid="outside-2">outside second</button>
<div data-testid="trap">
	<button data-testid="inside-1">first</button>
	<button data-testid="inside-2">second</button>
	<button data-testid="inside-3">third</button>
</div>
`;
});
afterEach(() => {
	document.body.innerHTML = '';
	trap?.deactivate();
});

it('ignores click outside by default', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement);

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(true);
});

it('ignores click outside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		clickOutsideDeactivates: false,
	});

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(true);
});

it('disables on click outside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		clickOutsideDeactivates: true,
	});

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(false);
});

it('disables on right click outside only with custom click handler', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		clickOutsideDeactivates: (ev) => ev.button === 2,
	});

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(true);

	await user.pointer({
		keys: '[MouseRight]',
		target: screen.getByTestId('outside-1'),
	});
	expect(trap.value.active).toBe(false);
});

it('ignores click outside before options are updated then disables on click outside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	const options = observable<FocusTrapOptions>({
		clickOutsideDeactivates: false,
	});
	trap = trapFocus(trapElement, options);

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(true);

	options.update(($options) => ({
		...$options,
		clickOutsideDeactivates: true,
	}));

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.value.active).toBe(false);
});
