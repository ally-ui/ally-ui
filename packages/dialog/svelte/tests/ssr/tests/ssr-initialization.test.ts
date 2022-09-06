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

it('renders an initially closed dialog', () => {
	document.body.innerHTML = rendered_closed;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
}, 10000);

it('renders an initially opened dialog', () => {
	document.body.innerHTML = rendered_open;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
}, 10000);
