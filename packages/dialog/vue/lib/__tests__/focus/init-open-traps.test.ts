import {cleanup, render, screen} from '@testing-library/vue';
import Focus from './focus.test.vue';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(Focus, {props: {initialOpen: true}});
	// Vue needs another frame for the child components to be mounted.
	await screen.findByTestId('content');
	expect(await screen.findByTestId('content')).toHaveFocusWithin();
});
