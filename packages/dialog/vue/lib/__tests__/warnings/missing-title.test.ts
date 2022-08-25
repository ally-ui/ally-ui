import {cleanup, render, screen} from '@testing-library/vue';
import MissingTitle from './missing-title.test.vue';

afterEach(() => {
	cleanup();
});

it('warns the user if the title component is missing', async () => {
	const warnSpy = vi.spyOn(console, 'warn');
	render(MissingTitle);
	await screen.findByTestId('content');
	expect(warnSpy).toHaveBeenCalledWith(
		'Dialogs should contain a title component for accessibility reasons',
	);
});