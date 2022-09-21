import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as Dialog from '../lib/main';

function ContentForceMount() {
	return (
		<React.StrictMode>
			<Dialog.Root>
				<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
				<Dialog.Content data-testid="content" forceMount>
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

afterEach(() => {
	cleanup();
});

it('keeps content open while still managing focus', async () => {
	const user = userEvent.setup();
	render(<ContentForceMount />);
	const content = screen.queryByTestId('content');
	expect(content).not.toBeNull();
	expect(content).not.toHaveFocusWithin();
	await user.click(screen.getByTestId('trigger'));
	expect(content).toHaveFocusWithin();
	await user.click(screen.getByTestId('close'));
	expect(content).not.toBeNull();
	expect(content).not.toHaveFocusWithin();
});
