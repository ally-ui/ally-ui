import {screen} from '@testing-library/dom';
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

it('focuses on the first element in the trap on activation', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('prevents focus going to the first element in the trap on activation', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({
		container: trapElement,
		onActivateAutoFocus: (ev) => ev.preventDefault(),
	});
	trap.activate();
	expect(screen.getByTestId('inside-1')).not.toHaveFocus();
});

it('returns focus to the previously focused element on deactivation', () => {
	const trapElement = screen.getByTestId('trap');
	screen.getByTestId('outside-1').focus();
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	trap.deactivate();
	expect(screen.getByTestId('outside-1')).toHaveFocus();
});

it('does not return focus if there is no previously focused element on deactivation', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	trap.deactivate();
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('prevents focus returning to the previous element on deactivation', () => {
	const trapElement = screen.getByTestId('trap');
	const returnElement = screen.getByTestId('outside-2');
	trap = observableFocusTrap({
		container: trapElement,
		onDeactivateAutoFocus: (ev) => {
			ev.preventDefault();
			returnElement.focus();
		},
	});
	trap.activate();
	trap.deactivate();
	expect(returnElement).toHaveFocus();
});
