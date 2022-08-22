import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Focus from './focus.test.svelte';

afterEach(async () => {
	cleanup();
});

it('returns focus to the trigger on deactivation', async () => {
	const user = userEvent.setup();
	render(Focus, {initialOpen: true});
	await user.click(screen.getByTestId('close'));
	expect(screen.getByTestId('trigger')).toHaveFocusWithin();
});
