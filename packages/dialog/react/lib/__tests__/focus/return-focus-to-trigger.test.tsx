import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(<Focus initialOpen />);
	await user.click(await screen.findByTestId('close'));
	expect(screen.getByTestId('trigger')).toHaveFocusWithin();
});
