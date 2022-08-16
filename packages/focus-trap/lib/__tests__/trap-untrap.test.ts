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

it('untraps on Esc', async () => {
	const user = userEvent.setup();
	screen.getByTestId('outside-1').focus();
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
	trap.deactivate();
	await user.keyboard('{Esc}');
	expect(screen.getByTestId('outside-1')).toHaveFocus();
});
