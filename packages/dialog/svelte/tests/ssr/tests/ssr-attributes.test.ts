import {screen} from '@testing-library/dom';
import {renderToString} from '../renderToString__client';

let rendered_open: string;
let rendered_closed: string;
beforeAll(async () => {
	rendered_open = await renderToString('init--open.test');
	rendered_closed = await renderToString('init--closed.test');
});
afterEach(() => {
	document.body.innerHTML = '';
});

describe('content', () => {
	beforeEach(() => {
		document.body.innerHTML = rendered_open;
	});
	it('renders the data state attribute on an open dialog', () => {
		document.body.innerHTML = rendered_open;
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	}, 10000);

	it('renders basic aria attributes', () => {
		document.body.innerHTML = rendered_open;
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	}, 10000);

	it('renders aria attributes that point to title and description', () => {
		document.body.innerHTML = rendered_open;
		const content = screen.getByTestId('content');
		const title = screen.getByTestId('title');
		const description = screen.getByTestId('description');
		expect(content).toHaveAttribute('aria-labelledby', title.id);
		expect(content).toHaveAttribute('aria-describedby', description.id);
	}, 10000);
});

describe('trigger', () => {
	it('renders the data state attribute with a closed dialog', () => {
		document.body.innerHTML = rendered_closed;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	}, 10000);

	it('renders the data state attribute with an open dialog', () => {
		document.body.innerHTML = rendered_open;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	}, 10000);

	it('renders basic aria attributes', () => {
		document.body.innerHTML = rendered_closed;
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	}, 10000);

	it('renders aria-controls that points to content', () => {
		document.body.innerHTML = rendered_open;
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	}, 10000);
});
