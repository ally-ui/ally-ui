import {cleanup, render, screen} from '@testing-library/svelte';
import Focus from './focus.test.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(Focus, {initialOpen: true});
	const content = await screen.findByTestId('content');
	expect(content).toHaveFocusWithin();
});
