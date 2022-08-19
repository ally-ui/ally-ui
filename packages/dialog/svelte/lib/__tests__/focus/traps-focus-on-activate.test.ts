import {act, cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {writable} from 'svelte/store';
import Focus from './focus.test.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog on open', async () => {
	const user = userEvent.setup();
	render(Focus, {initialOpen: false});
	await user.click(screen.getByTestId('trigger'));
	const content = screen.getByTestId('content');
	expect(content).toHaveFocusWithin();
});
