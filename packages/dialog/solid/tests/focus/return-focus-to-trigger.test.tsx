import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from 'solid-testing-library';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('returns focus to the trigger on deactivation', async () => {
	const user = userEvent.setup();
	render(() => <Focus initialOpen />);
	await user.click(await screen.findByTestId('close'));
	expect(screen.getByTestId('trigger')).toHaveFocus();
});
