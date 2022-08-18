import {screen} from '@testing-library/dom';
import {afterEach, beforeAll, describe, expect, it} from 'vitest';
import {renderServerTemplate} from '../renderServerTemplate';

let rendered_open: string;
let rendered_closed: string;
beforeAll(async () => {
	rendered_open = await renderServerTemplate('init--open');
	rendered_closed = await renderServerTemplate('init--closed');
});
afterEach(() => {
	document.body.innerHTML = '';
});

describe('trigger', () => {
	it('renders the data state attribute with a closed dialog', () => {
		document.body.innerHTML = rendered_closed;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders the data state attribute with an open dialog', () => {
		document.body.innerHTML = rendered_open;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		document.body.innerHTML = rendered_closed;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('has aria-controls that points to content', () => {
		document.body.innerHTML = rendered_open;
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
