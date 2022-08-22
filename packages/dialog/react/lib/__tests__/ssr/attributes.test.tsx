import {screen} from '@testing-library/dom';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Dialog} from '../../main';

afterEach(() => {
	document.body.innerHTML = '';
});

function RenderedOpen() {
	return (
		<React.StrictMode>
			<Dialog.Root initialOpen>
				<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
				<Dialog.Content data-testid="content">
					<Dialog.Title data-testid="title">title</Dialog.Title>
					<Dialog.Description data-testid="description">
						description
					</Dialog.Description>
					<Dialog.Close data-testid="close">close dialog</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</React.StrictMode>
	);
}
const rendered_open = ReactDOMServer.renderToString(<RenderedOpen />);

export function RenderedClosed() {
	return (
		<React.StrictMode>
			<Dialog.Root>
				<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
				<Dialog.Content data-testid="content">
					<Dialog.Title data-testid="title">title</Dialog.Title>
					<Dialog.Description data-testid="description">
						description
					</Dialog.Description>
					<Dialog.Close data-testid="close">close dialog</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</React.StrictMode>
	);
}
const rendered_closed = ReactDOMServer.renderToString(<RenderedClosed />);

describe('content', () => {
	beforeEach(() => {
		document.body.innerHTML = rendered_open;
	});
	it('renders the data state attribute on an open dialog', () => {
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	});

	it('renders aria attributes that point to title and description', () => {
		const content = screen.getByTestId('content');
		const title = screen.getByTestId('title');
		const description = screen.getByTestId('description');
		expect(content).toHaveAttribute('aria-labelledby', title.id);
		expect(content).toHaveAttribute('aria-describedby', description.id);
	});
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

	it('renders aria-controls that points to content', () => {
		document.body.innerHTML = rendered_open;
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
