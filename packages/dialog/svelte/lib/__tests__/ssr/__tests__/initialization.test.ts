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
	expect(screen.queryByTestId('trigger')).toBeInTheDocument();
	expect(screen.queryByTestId('content')).not.toBeInTheDocument();
	expect(screen.queryByTestId('title')).not.toBeInTheDocument();
	expect(screen.queryByTestId('description')).not.toBeInTheDocument();
	expect(screen.queryByTestId('close')).not.toBeInTheDocument();
});

it('renders an initially opened dialog', () => {
	document.body.innerHTML = rendered_open;
	expect(screen.queryByTestId('trigger')).toBeInTheDocument();
	expect(screen.queryByTestId('content')).toBeInTheDocument();
	expect(screen.queryByTestId('title')).toBeInTheDocument();
	expect(screen.queryByTestId('description')).toBeInTheDocument();
	expect(screen.queryByTestId('close')).toBeInTheDocument();
});
