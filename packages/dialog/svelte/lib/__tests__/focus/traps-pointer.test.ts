import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Template from '../template.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(Template, {initialOpen: true});
	const content = screen.getByTestId('content');
	await user.click(screen.getByTestId('trigger'));
	expect(content).toHaveFocusWithin();
});
