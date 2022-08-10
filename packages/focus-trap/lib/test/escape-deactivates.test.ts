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

it('disables on escape by default', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement);

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(false);
});

it('disables on escape', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		escapeDeactivates: true,
	});

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(false);
});

it('ignore escape', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		escapeDeactivates: false,
	});

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(true);
});

it('disables on escape only with shift', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		escapeDeactivates: (ev) => ev.shiftKey,
	});

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(true);

	await user.keyboard('{Shift>}{Esc}{/Shift}');
	expect(trap.value.active).toBe(false);
});

it('ignores escape before options are updated then disables on escape', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	const options = observable<FocusTrapOptions>({
		escapeDeactivates: false,
	});
	trap = trapFocus(trapElement, options);

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(true);

	options.update(($options) => ({
		...$options,
		escapeDeactivates: true,
	}));

	await user.keyboard('{Esc}');
	expect(trap.value.active).toBe(false);
});
