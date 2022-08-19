import {screen} from '@testing-library/dom';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {afterEach, expect, it} from 'vitest';
import {InitClosedTemplate, InitOpenTemplate} from './templates';

afterEach(() => {
	document.body.innerHTML = '';
});

const rendered_open = ReactDOMServer.renderToString(
	<React.StrictMode>
		<InitOpenTemplate />
	</React.StrictMode>,
);

const rendered_closed = ReactDOMServer.renderToString(
	<React.StrictMode>
		<InitClosedTemplate />
	</React.StrictMode>,
);

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
