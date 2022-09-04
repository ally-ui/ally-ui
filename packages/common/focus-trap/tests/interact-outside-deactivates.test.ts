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

it('does not disable on click inside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();

	await user.click(screen.getByTestId('inside-1'));
	expect(trap.state.active).toBe(true);
});

it('disables on click outside by default', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.state.active).toBe(false);
});

it('does not disable on click outside when interact outside is prevented', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		onInteractOutside: (ev) => ev.preventDefault(),
	});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.state.active).toBe(true);
});

it('only disables on right click outside with custom on interact outside handler', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		onInteractOutside: (ev) => {
			if (ev instanceof MouseEvent && ev.button !== 2) {
				ev.preventDefault();
			}
		},
	});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.state.active).toBe(true);

	await user.pointer({
		keys: '[MouseRight]',
		target: screen.getByTestId('outside-1'),
	});
	expect(trap.state.active).toBe(false);
});
