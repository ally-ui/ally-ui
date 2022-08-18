import {screen} from '@testing-library/dom';
import {afterEach, beforeAll, expect, it} from 'vitest';
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

it('renders an initially closed dialog', () => {
	document.body.innerHTML = rendered_closed;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('renders an initially opened dialog', () => {
	document.body.innerHTML = rendered_open;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
