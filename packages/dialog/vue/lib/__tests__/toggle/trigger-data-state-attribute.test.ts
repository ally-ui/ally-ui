import userEvent from '@testing-library/user-event';
import {render, screen} from '@testing-library/vue';
import Toggle from './toggle.test.vue';

it('updates the data state attribute when the dialog opens and closes', async () => {
	const user = userEvent.setup();
	render(Toggle);
	const trigger = await screen.findByTestId('trigger');

	await user.click(trigger);
	await screen.findByTestId('title');
	expect(trigger).toHaveAttribute('data-state', 'open');

	await user.click(await screen.findByTestId('close'));
	expect(trigger).toHaveAttribute('data-state', 'closed');
});

it('updates the data state attribute when the dialog closes and opens', async () => {
	const user = userEvent.setup();
	render(Toggle, {props: {initialOpen: true}});
	const trigger = await screen.findByTestId('trigger');

	await user.click(await screen.findByTestId('close'));
	expect(trigger).toHaveAttribute('data-state', 'closed');

	await user.click(trigger);
	await screen.findByTestId('title');
	expect(trigger).toHaveAttribute('data-state', 'open');
});
