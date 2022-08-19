import {screen} from '@testing-library/dom';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import {Dialog, useDialog} from '../../main';

function InitOpenTemplate() {
	const dialog = useDialog({initialOpen: true});
	return (
		<>
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
		</>
	);
}

function InitClosedTemplate() {
	const dialog = useDialog();
	return (
		<>
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
		</>
	);
}

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
