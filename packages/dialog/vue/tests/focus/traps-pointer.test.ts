import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from '@testing-library/vue';
import Focus from './focus.test.vue';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(Focus, {props: {initialOpen: true}});
	const content = screen.getByTestId('content');
	await user.click(screen.getByTestId('trigger'));
	expect(content).toHaveFocusWithin();
});
