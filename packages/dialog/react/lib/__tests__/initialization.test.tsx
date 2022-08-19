import {cleanup, render, screen} from '@testing-library/react';
import React from 'react';
import {Dialog, useDialog} from '../main';
import {UseDialogOptions} from '../useDialog';

function Initialization(options: UseDialogOptions) {
	const dialog = useDialog(options);
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

afterEach(() => {
	cleanup();
});

it('hides an initially closed dialog', () => {
	render(<Initialization />);
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('shows an initially opened dialog', () => {
	render(<Initialization initialOpen />);
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
