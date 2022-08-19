import {cleanup, render, screen} from '@testing-library/svelte';
import {vi} from 'vitest';
import MissingTitle from './missing-title.test.svelte';

afterEach(() => {
	cleanup();
});

it('warns the user if the title component is missing', async () => {
	const warnSpy = vi.spyOn(console, 'warn');
	render(MissingTitle);
	expect(warnSpy).toHaveBeenCalledWith(
		'Dialogs should contain a title component for accessibility reasons',
	);
});
