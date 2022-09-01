import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Toggle from './Toggle';

afterEach(async () => {
	cleanup();
});

it('closes the dialog on close click', async () => {
	const user = userEvent.setup();
	render(<Toggle initialOpen />);
	await user.click(await screen.findByTestId('close'));
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});
