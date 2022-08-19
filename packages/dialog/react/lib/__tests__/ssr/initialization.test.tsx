import {screen} from '@testing-library/dom';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {Dialog, useDialog} from '../../main';

afterEach(() => {
	document.body.innerHTML = '';
});

function RenderedOpen() {
	const dialog = useDialog({initialOpen: true});
	return (
		<React.StrictMode>
			<Dialog.Trigger model={dialog} data-testid="trigger">
				open dialog
			</Dialog.Trigger>
			<Dialog.Content model={dialog} data-testid="content">
				<Dialog.Title model={dialog} data-testid="title">
					title
				</Dialog.Title>
				<Dialog.Description model={dialog} data-testid="description">
					description
				</Dialog.Description>
				<Dialog.Close model={dialog} data-testid="close">
					close dialog
				</Dialog.Close>
			</Dialog.Content>
		</React.StrictMode>
	);
}
const rendered_open = ReactDOMServer.renderToString(<RenderedOpen />);

export function RenderedClosed() {
	const dialog = useDialog();
	return (
		<React.StrictMode>
			<Dialog.Trigger model={dialog} data-testid="trigger">
				open dialog
			</Dialog.Trigger>
			<Dialog.Content model={dialog} data-testid="content">
				<Dialog.Title model={dialog} data-testid="title">
					title
				</Dialog.Title>
				<Dialog.Description model={dialog} data-testid="description">
					description
				</Dialog.Description>
				<Dialog.Close model={dialog} data-testid="close">
					close dialog
				</Dialog.Close>
			</Dialog.Content>
		</React.StrictMode>
	);
}
const rendered_closed = ReactDOMServer.renderToString(<RenderedClosed />);

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
