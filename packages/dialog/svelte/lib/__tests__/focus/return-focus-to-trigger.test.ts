import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Focus from './focus.test.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(Focus, {initialOpen: true});
	await user.click(screen.getByTestId('close'));
	expect(screen.getByTestId('trigger')).toHaveFocusWithin();
});
