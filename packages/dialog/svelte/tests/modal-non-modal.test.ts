import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ModalNonModal from './modal-non-modal.test.svelte';

afterEach(async () => {
	cleanup();
});

it('removes the aria-modal attribute for non-modal dialogs', () => {
	render(ModalNonModal);
	const content = screen.getByTestId('content');
	expect(content).not.toHaveAttribute('aria-modal');
});

it('toggles the aria-modal attribute', async () => {
	const user = userEvent.setup();
	render(ModalNonModal);
	const content = screen.getByTestId('content');
	expect(content).not.toHaveAttribute('aria-modal');
	await user.click(screen.getByTestId('toggle-modal'));
	expect(content).toHaveAttribute('aria-modal', 'true');
	await user.click(screen.getByTestId('toggle-modal'));
	expect(content).not.toHaveAttribute('aria-modal');
});
