import {cleanup, render, screen} from '@testing-library/react';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(<Focus initialOpen />);
	const content = await screen.findByTestId('content');
	expect(content).toHaveFocusWithin();
});

it('traps focus in the dialog if state is initially open', async () => {
	render(<Focus open />);
	const content = await screen.findByTestId('content');
	expect(content).toHaveFocusWithin();
});
