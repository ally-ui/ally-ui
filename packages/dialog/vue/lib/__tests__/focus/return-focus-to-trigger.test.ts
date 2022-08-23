import userEvent from '@testing-library/user-event';
import {cleanup, render, screen} from '@testing-library/vue';
import Focus from './focus.test.vue';

afterEach(async () => {
	cleanup();
});

it('returns focus to the trigger on deactivation', async () => {
	const user = userEvent.setup();
	render(Focus, {props: {initialOpen: true}});
	await user.click(screen.getByTestId('close'));
	expect(screen.getByTestId('trigger')).toHaveFocusWithin();
});
