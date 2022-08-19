import {act, cleanup, render, screen} from '@testing-library/react';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(<Focus initialOpen />);
	const content = await screen.findByTestId('content');
	expect(content).toHaveFocusWithin();
});
