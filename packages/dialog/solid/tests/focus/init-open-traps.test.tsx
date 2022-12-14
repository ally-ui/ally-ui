import {cleanup, render, screen} from 'solid-testing-library';
import Focus from './Focus';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(() => <Focus initialOpen />);
	const content = await screen.findByTestId('content');
	await new Promise((res) => setTimeout(res));
	expect(content).toHaveFocusWithin();
});

it('traps focus in the dialog if state is initially open', async () => {
	render(() => <Focus open />);
	const content = await screen.findByTestId('content');
	// Solid needs another frame for the child components to be mounted.
	await new Promise((res) => setTimeout(res));
	expect(content).toHaveFocusWithin();
});
