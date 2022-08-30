import {screen} from '@testing-library/dom';
import type {FocusTrapModel} from '../FocusTrapModel';
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

it('focuses on the first element in the trap when trapped', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('returns focus to the previously focused element when untrapped', () => {
	const trapElement = screen.getByTestId('trap');
	screen.getByTestId('outside-1').focus();
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	trap.deactivate();
	expect(screen.getByTestId('outside-1')).toHaveFocus();
});

it('does not return focus if no previously focused element when untrapped', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	trap.deactivate();
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('returns focus to a returnFocus element', () => {
	const trapElement = screen.getByTestId('trap');
	const returnElement = screen.getByTestId('outside-2');
	trap = observableFocusTrap({
		container: trapElement,
		returnFocusTo: returnElement,
	});
	trap.activate();
	trap.deactivate();
	expect(returnElement).toHaveFocus();
});

it('returns focus to a dynamic returnFocus element', () => {
	const trapElement = screen.getByTestId('trap');
	const firstElement = screen.getByTestId('outside-1');
	const secondElement = screen.getByTestId('outside-2');
	let element = firstElement;
	trap = observableFocusTrap({
		container: trapElement,
		returnFocusTo: () => element,
	});
	trap.activate();
	element = secondElement;
	trap.deactivate();
	expect(secondElement).toHaveFocus();
});
