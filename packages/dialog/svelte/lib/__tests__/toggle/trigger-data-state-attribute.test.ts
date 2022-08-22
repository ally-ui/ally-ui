import {render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import Toggle from './toggle.test.svelte';

it('updates the data state attribute on the trigger when the dialog opens and closes', async () => {
	const user = userEvent.setup();
	render(Toggle, {initialOpen: true});
	const trigger = await screen.findByTestId('trigger');
	await user.click(await screen.findByTestId('close'));
	expect(trigger).toHaveAttribute('data-state', 'closed');
	await user.click(trigger);
	await screen.findByTestId('title');
	expect(trigger).toHaveAttribute('data-state', 'open');
});
