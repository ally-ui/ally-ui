import {DialogRootModel} from '@ally-ui/core-dialog';
import {cleanup, render, screen} from '@testing-library/svelte';
import MissingTitle from './missing-title.test.svelte';

afterEach(() => {
	cleanup();
});

it('warns the user if the title component is missing', async () => {
	const warnSpy = vi.spyOn(console, 'warn');
	render(MissingTitle);
	await screen.findByTestId('content');
	expect(warnSpy).toHaveBeenCalledWith(DialogRootModel.MISSING_TITLE_WARNING);
});
