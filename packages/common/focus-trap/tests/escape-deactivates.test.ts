import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import type {FocusTrapModel} from '../lib/FocusTrapModel';
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
	expect(trap.state.active).toBe(false);
});

it('does not escape when escape is prevented', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		onEscapeKeyDown: (ev) => ev.preventDefault(),
	});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.state.active).toBe(true);
});

it('only disables on escape with shift', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		onEscapeKeyDown: (ev) => {
			if (!ev.shiftKey) {
				ev.preventDefault();
			}
		},
	});
	trap.activate();

	await user.keyboard('{Esc}');
	expect(trap.state.active).toBe(true);

	await user.keyboard('{Shift>}{Esc}{/Shift}');
	expect(trap.state.active).toBe(false);
});
