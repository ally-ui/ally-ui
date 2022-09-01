import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from 'solid-testing-library';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog on open', async () => {
	const user = userEvent.setup();
	render(() => <Focus />);
	await user.click(await screen.findByTestId('trigger'));
	const content = await screen.findByTestId('content');
	expect(content).toHaveFocusWithin();
});
