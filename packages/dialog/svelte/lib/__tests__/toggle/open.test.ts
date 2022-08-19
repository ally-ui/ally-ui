import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Template from '../template.svelte';

afterEach(async () => {
	cleanup();
});

it('opens the dialog on trigger click', async () => {
	const user = userEvent.setup();
	render(Template);
	await user.click(screen.getByTestId('trigger'));
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
