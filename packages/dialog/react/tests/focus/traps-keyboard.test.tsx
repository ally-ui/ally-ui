import {cleanup, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(<Focus initialOpen />);
	const content = await screen.findByTestId('content');
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
});
