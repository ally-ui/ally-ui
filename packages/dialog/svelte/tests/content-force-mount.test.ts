import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import ContentForceMount from './content-force-mount.test.svelte';

afterEach(async () => {
	cleanup();
});

it('keeps content open while still managing focus', async () => {
	const user = userEvent.setup();
	render(ContentForceMount);
	const content = screen.queryByTestId('content');
	expect(content).not.toBeNull();
	expect(content).not.toHaveFocusWithin();
	await user.click(screen.getByTestId('trigger'));
	expect(content).toHaveFocusWithin();
	await user.click(screen.getByTestId('close'));
	expect(content).not.toBeNull();
	expect(content).not.toHaveFocusWithin();
});
