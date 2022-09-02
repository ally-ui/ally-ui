import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Dialog from '../lib/main';

interface ModalNonModalProps {
	initialModal: boolean;
}

function ModalNonModal({initialModal}: ModalNonModalProps) {
	const [modal, setModal] = React.useState(initialModal);
	return (
		<React.StrictMode>
			<button onClick={() => setModal((m) => !m)} data-testid="toggle-modal">
				modal
			</button>
			<Dialog.Root modal={modal}>
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

it('removes the aria-modal attribute for non-modal dialogs', () => {
	render(<ModalNonModal initialModal={false} />);
	const content = screen.getByTestId('content');
	expect(content).not.toHaveAttribute('aria-modal');
});

it('toggles the aria-modal attribute', async () => {
	const user = userEvent.setup();
	render(<ModalNonModal initialModal={false} />);
	const content = screen.getByTestId('content');
	expect(content).not.toHaveAttribute('aria-modal');
	await user.click(screen.getByTestId('toggle-modal'));
	expect(content).toHaveAttribute('aria-modal', 'true');
	await user.click(screen.getByTestId('toggle-modal'));
	expect(content).not.toHaveAttribute('aria-modal');
});
