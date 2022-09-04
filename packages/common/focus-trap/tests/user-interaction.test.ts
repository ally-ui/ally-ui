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
	const trapElement = screen.getByTestId('trap');
	trap = observableFocusTrap({container: trapElement});
	trap.activate();
});
afterEach(() => {
	document.body.innerHTML = '';
	trap?.deactivate();
});

describe('tab behavior', () => {
	it('focuses from the last to first focusable child element', async () => {
		const user = userEvent.setup();
		await user.tab();
		expect(screen.getByTestId('inside-2')).toHaveFocus();
		await user.tab();
		expect(screen.getByTestId('inside-3')).toHaveFocus();
		await user.tab();
		expect(screen.getByTestId('inside-1')).toHaveFocus();
	});

	it('focuses from the first to last focusable child element', async () => {
		const user = userEvent.setup();
		await user.tab({shift: true});
		expect(screen.getByTestId('inside-3')).toHaveFocus();
		await user.tab({shift: true});
		expect(screen.getByTestId('inside-2')).toHaveFocus();
		await user.tab({shift: true});
		expect(screen.getByTestId('inside-1')).toHaveFocus();
		await user.tab({shift: true});
		expect(screen.getByTestId('inside-3')).toHaveFocus();
	});

	it('does not move focus with only one focusable child element', async () => {
		const user = userEvent.setup();

		// Custom setup.
		trap?.deactivate();
		document.body.innerHTML = `
			<button data-testid="outside-1">outside first</button>
			<button data-testid="outside-2">outside second</button>
			<div data-testid="trap">
				<button data-testid="inside-1">first</button>
			</div>
		`;
		const trapElement = screen.getByTestId('trap');
		trap = observableFocusTrap({container: trapElement});
		trap.activate();

		await user.tab();
		expect(screen.getByTestId('inside-1')).toHaveFocus();
		await user.tab();
		expect(screen.getByTestId('inside-1')).toHaveFocus();
	});
});

describe('click behavior', () => {
	it('blocks clicks outside an active trap', async () => {
		const user = userEvent.setup();
		const button_outside1 = screen.getByTestId('outside-1');
		const onClick = vi.fn();
		button_outside1.addEventListener('click', onClick);

		await user.click(button_outside1);
		expect(onClick).not.toHaveBeenCalled();

		trap?.deactivate();
		await user.click(button_outside1);
		expect(onClick).toHaveBeenCalledOnce();
	});
});

describe('touch behavior', () => {
	it('blocks single touches outside an active trap', async () => {
		const user = userEvent.setup();
		const button_outside1 = screen.getByTestId('outside-1');
		const onClick = vi.fn();
		button_outside1.addEventListener('click', onClick);

		await user.pointer([
			{keys: '[TouchA>]', target: button_outside1},
			{keys: '[/TouchA]'},
		]);
		expect(onClick).not.toHaveBeenCalled();

		trap?.deactivate();
		await user.pointer([
			{keys: '[TouchA>]', target: button_outside1},
			{keys: '[/TouchA]'},
		]);
		expect(onClick).toHaveBeenCalledOnce();
	});
});
