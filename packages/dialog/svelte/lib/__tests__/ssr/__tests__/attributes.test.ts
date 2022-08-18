import {screen} from '@testing-library/dom';
import {describe, expect, it} from 'vitest';
import {renderServerTemplate} from '../renderServerTemplate';

describe('trigger', () => {
	it('renders the data state attribute on a closed dialog', async () => {
		const rendered = await renderServerTemplate('init--closed');
		document.body.innerHTML = rendered;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders the data state attribute on an open dialog', async () => {
		const rendered = await renderServerTemplate('init--open');
		document.body.innerHTML = rendered;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});
});
