import {screen} from '@testing-library/dom';
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

it('activates on initialization if initialActive is true', () => {
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement, initialActive: true});
	expect(screen.getByTestId('inside-1')).toHaveFocus();
});
