import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, expect, it, vi} from 'vitest';
import {FocusTrap, trapFocus} from '../main';

let trap: FocusTrap | undefined;
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

it('calls onDeactivate when deactivating', async () => {
	const user = userEvent.setup();
	const onDeactivate = vi.fn();

	const trapElement = screen.getByTestId('trap');
	trap = trapFocus(trapElement, {
		onDeactivate,
	});

	await user.keyboard('{Esc}');
	expect(onDeactivate).toHaveBeenCalledOnce();
});
