import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import {vi} from 'vitest';
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
	it('ignores clicks outside trap', async () => {
		const user = userEvent.setup();
		const button_outside1 = screen.getByTestId('outside-1');
		const onClick = vi.fn();
		button_outside1.addEventListener('click', onClick);

		await user.pointer([{target: button_outside1}, {keys: '[MouseLeft]'}]);
		expect(onClick).not.toHaveBeenCalled();

		trap?.deactivate();
		await user.pointer([{target: button_outside1}, {keys: '[MouseLeft]'}]);
		expect(onClick).toHaveBeenCalledOnce();
	});
});

describe('touch behavior', () => {
	it('ignores single touches outside trap', async () => {
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

	it('allows gestures', async () => {
		const user = userEvent.setup();
		const button_outside1 = screen.getByTestId('outside-1');
		const onClick = vi.fn();
		button_outside1.addEventListener('click', onClick);
		const button_inside1 = screen.getByTestId('inside-1');

		await user.pointer([
			{keys: '[TouchA>]', target: button_outside1},
			{keys: '[TouchB>]', target: button_inside1},
			{pointerName: 'TouchA', target: button_inside1},
			{keys: '[/TouchA]'},
			{keys: '[/TouchB]'},
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
