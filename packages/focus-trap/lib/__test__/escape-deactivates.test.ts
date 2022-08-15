import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, expect, it} from 'vitest';
import {FocusTrapModel} from '../main';
import {observableFocusTrap} from './observableFocusTrap';

let trap: FocusTrapModel | undefined;
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
	trap = observableFocusTrap({container: trapElement});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.options.state.active).toBe(false);
});

it('disables on escape', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		escapeDeactivates: true,
	});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.options.state.active).toBe(false);
});

it('ignore escape', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		escapeDeactivates: false,
	});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.options.state.active).toBe(true);
});

it('disables on escape only with shift', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		escapeDeactivates: (ev) => ev.shiftKey,
	});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.options.state.active).toBe(true);

	await user.keyboard('{Shift>}{Esc}{/Shift}');
	expect(trap.options.state.active).toBe(false);
});
