import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from 'solid-testing-library';
import Toggle from './Toggle';

afterEach(async () => {
	cleanup();
});

it('closes the dialog on escape', async () => {
	const user = userEvent.setup();
	render(() => <Toggle initialOpen />);
	await user.keyboard('{Esc}');
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});
