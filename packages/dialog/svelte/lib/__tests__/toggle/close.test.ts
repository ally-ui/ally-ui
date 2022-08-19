import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Template from '../template.svelte';

afterEach(async () => {
	cleanup();
});

it('closes the dialog on close click', async () => {
	const user = userEvent.setup();
	render(Template, {initialOpen: true});
	await user.click(screen.getByTestId('close'));
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});
