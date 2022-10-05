import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import type {FocusTrapModel} from '../lib/FocusTrapModel';
import {observableFocusTrap} from './observableFocusTrap';

let trap: FocusTrapModel | undefined;
beforeEach(() => {
	document.body.innerHTML = `
<button data-testid="outside-1">outside first</button>
<button data-testid="outside-2">outside second</button>
<div data-testid="trap-1">
	<button data-testid="inside-1">first</button>
	<button data-testid="inside-2">second</button>
	<button data-testid="inside-3">third</button>
	<div data-testid="trap-2">
		<button data-testid="inner-1">inner first</button>
		<button data-testid="inner-2">inner second</button>
		<button data-testid="inner-3">inner third</button>
	</div>
</div>
`;
});
afterEach(() => {
	document.body.innerHTML = '';
	trap?.deactivate();
});

it('returns focus from the nested to outer focus trap', async () => {
	const user = userEvent.setup();

	const trapElement = screen.getByTestId('trap-1');
	const innerTrapElement = screen.getByTestId('trap-2');
	trap = observableFocusTrap();
	trap.bind(trapElement);
	trap.activate();
	const innerTrap = observableFocusTrap();
	innerTrap.bind(innerTrapElement);
	innerTrap.activate();

	expect(screen.getByTestId('inner-1')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-2')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-3')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-1')).toHaveFocus();

	innerTrap.deactivate();

	expect(screen.getByTestId('inside-1')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inside-2')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inside-3')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-1')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-2')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inner-3')).toHaveFocus();
	await user.tab();
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});
