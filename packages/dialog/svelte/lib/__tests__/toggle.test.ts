import {cleanup, render, screen} from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import {writable, type Writable} from 'svelte/store';
import {afterEach, beforeEach, expect, it} from 'vitest';
import Template from './toggle.svelte';

let open: Writable<boolean>;
beforeEach(() => {
	open = writable(true);
});
afterEach(async () => {
	cleanup();
});

it('hides an initially closed dialog', () => {
	render(Template);
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('shows an initially opened dialog', () => {
	render(Template, {initialOpen: true});
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});

it('opens the dialog on trigger click', async () => {
	const user = userEvent.setup();
	render(Template);
	await user.click(screen.getByTestId('trigger'));
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
