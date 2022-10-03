import {screen} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import type {FocusTrapModel} from '../lib/FocusTrapModel';
import {observableFocusTrap} from './observableFocusTrap';

let trap: FocusTrapModel | undefined;
afterEach(() => {
	document.body.innerHTML = '';
	trap?.deactivate();
});

describe('tracks the correct DOM elements', () => {
	beforeEach(() => {
		document.body.innerHTML = `
<button data-testid="outside-1">outside first</button>
<button data-testid="outside-2">outside second</button>
<div data-testid="trap">
	<button data-testid="inside-1">first</button>
</div>
`;
		const trapElement = screen.getByTestId('trap');
		trap = observableFocusTrap();
		trap.onBind(trapElement);
		trap.activate();
	});

	const ELEMENTS = [
		{tag: 'input', attributes: {}},
		{tag: 'select', attributes: {}},
		{tag: 'textarea', attributes: {}},
		{tag: 'button', attributes: {}},
		{tag: 'anchor', attributes: {}},
		{tag: 'div', attributes: {tabindex: '0'}},
	] as const;

	describe.each(ELEMENTS)('tracks', (el) => {
		it(`${el.tag} elements`, async () => {
			const user = userEvent.setup();
			const trapElement = screen.getByTestId('trap');
			const addedElement = document.createElement('input');
			Object.entries(el.attributes).forEach(([key, value]) => {
				addedElement.setAttribute(key, value);
			});
			trapElement.appendChild(addedElement);

			await user.tab();
			expect(addedElement).toHaveFocus();
			await user.tab();
			expect(screen.getByTestId('inside-1')).toHaveFocus();
		});
	});
});

describe('dynamic DOM', () => {
	beforeEach(() => {
		document.body.innerHTML = `
<button data-testid="outside-1">outside first</button>
<button data-testid="outside-2">outside second</button>
<div data-testid="trap">
	<button data-testid="inside-1">first</button>
	<p data-testid="inside-p">paragraph</p>
	<button data-testid="inside-2">second</button>
	text
</div>
`;
		const trapElement = screen.getByTestId('trap');
		trap = observableFocusTrap();
		trap.onBind(trapElement);
		trap.activate();
	});

	it('accounts for an updated tabindex on a child', async () => {
		const user = userEvent.setup();

		const paragraph = screen.getByTestId('inside-p');
		paragraph.setAttribute('tabindex', '0');

		await user.tab();
		expect(paragraph).toHaveFocus();
	});

	it('accounts for a newly added focusable child node', async () => {
		const user = userEvent.setup();

		const button_new = document.createElement('button');
		const trapElement = screen.getByTestId('trap');
		trapElement.appendChild(button_new);

		await user.tab();
		await user.tab();
		expect(button_new).toHaveFocus();
	});

	it('accounts for a removed focusable child node', async () => {
		const user = userEvent.setup();

		const trapElement = screen.getByTestId('trap');
		trapElement.removeChild(screen.getByTestId('inside-2'));

		await user.tab();
		expect(screen.getByTestId('inside-1')).toHaveFocus();
	});

	it('ignores character updates', async () => {
		const user = userEvent.setup();

		const text = screen.getByText('text');
		text.childNodes.item(6).textContent = 'updated';

		await user.tab();
		expect(screen.getByTestId('inside-2')).toHaveFocus();
	});
});
