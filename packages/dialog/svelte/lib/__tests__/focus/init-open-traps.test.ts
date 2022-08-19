import {act, cleanup, render, screen} from '@testing-library/svelte';
import {afterEach, expect, it} from 'vitest';
import Template from '../template.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus in the dialog if initially open', async () => {
	render(Template, {initialOpen: true});
	const content = screen.getByTestId('content');
	await act();
	expect(content).toHaveFocusWithin();
});
