import {screen} from '@testing-library/dom';
import {writable} from 'svelte/store';
import type {FocusTrapModel, FocusTrapModelState} from '../lib/FocusTrapModel';
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
	screen.getByTestId('outside-1').focus();
});
afterEach(() => {
	document.body.innerHTML = '';
	trap?.deactivate();
});

it('activates if active state initializes as true', () => {
	const trapElement = screen.getByTestId('trap');
	const manualTrapState = writable<FocusTrapModelState>({
		active: true,
		modal: true,
	});
	trap = observableFocusTrap({}, {}, manualTrapState);
	trap.bind(trapElement);
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('deactivates if active state initializes as false', () => {
	const trapElement = screen.getByTestId('trap');
	const manualTrapState = writable<FocusTrapModelState>({
		active: false,
		modal: true,
	});
	trap = observableFocusTrap({}, {}, manualTrapState);
	trap.bind(trapElement);
	expect(screen.getByTestId('inside-1')).not.toHaveFocus();
});

it('activates if active is manually set to true', () => {
	const trapElement = screen.getByTestId('trap');
	const manualTrapState = writable<FocusTrapModelState>({
		active: false,
		modal: true,
	});
	trap = observableFocusTrap({}, {}, manualTrapState);
	trap.bind(trapElement);
	manualTrapState.update((prev) => ({...prev, active: true}));
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});

it('deactivates if active is manually set to false', () => {
	const trapElement = screen.getByTestId('trap');
	const manualTrapState = writable<FocusTrapModelState>({
		active: true,
		modal: true,
	});
	trap = observableFocusTrap({}, {}, manualTrapState);
	trap.bind(trapElement);
	manualTrapState.update((prev) => ({...prev, active: false}));
	expect(screen.getByTestId('inside-1')).not.toHaveFocus();
});
