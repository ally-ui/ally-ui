import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {afterEach, expect, it} from 'vitest';
import Template from '../template.svelte';

afterEach(async () => {
	cleanup();
});

it('traps focus on tab', async () => {
	const user = userEvent.setup();
	render(Template, {initialOpen: true});
	const content = screen.getByTestId('content');
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
	await user.keyboard('{Tab}');
	expect(content).toHaveFocusWithin();
});
