import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
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

it('ignores click inside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();

	await user.click(screen.getByTestId('inside-1'));
	expect(trap.getState().active).toBe(true);
});

it('ignores click outside by default', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.getState().active).toBe(true);
});

it('ignores click outside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		clickOutsideDeactivates: false,
	});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.getState().active).toBe(true);
});

it('disables on click outside', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		clickOutsideDeactivates: true,
	});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.getState().active).toBe(false);
});

it('disables on right click outside only with custom click handler', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		clickOutsideDeactivates: (ev) => ev.button === 2,
	});
	trap.activate();

	await user.click(screen.getByTestId('outside-1'));
	expect(trap.getState().active).toBe(true);

	await user.pointer({
		keys: '[MouseRight]',
		target: screen.getByTestId('outside-1'),
	});
	expect(trap.getState().active).toBe(false);
});
