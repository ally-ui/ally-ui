import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from '@testing-library/vue';
import Focus from './focus.test.vue';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog on open', async () => {
	const user = userEvent.setup();
	render(Focus, {props: {initialOpen: false}});
	await user.click(screen.getByTestId('trigger'));
	const content = screen.getByTestId('content');
	expect(content).toHaveFocusWithin();
});
