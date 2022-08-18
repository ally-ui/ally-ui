import {cleanup, render, screen} from '@testing-library/svelte';
import {writable} from 'svelte/store';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import Template from './attributes.svelte';

const open = writable(false);
beforeEach(() => {
	open.set(false);
});
afterEach(() => {
	cleanup();
});

describe('content', () => {
	it('renders the data state attribute on an open dialog', () => {
		open.set(true);
		render(Template, {open});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		open.set(true);
		render(Template, {open});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	});

	it('renders aria attributes that point to title and description', () => {
		open.set(true);
		render(Template, {open});
		const content = screen.getByTestId('content');
		const title = screen.getByTestId('title');
		const description = screen.getByTestId('description');
		expect(content).toHaveAttribute('aria-labelledby', title.id);
		expect(content).toHaveAttribute('aria-describedby', description.id);
	});
});

describe('trigger', () => {
	it('renders the data state attribute with a closed dialog', () => {
		render(Template);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders the data state attribute with an open dialog', () => {
		open.set(true);
		render(Template, {open});
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('updates the data state attribute when the dialog opens and closes', () => {
		render(Template, {open});
		const trigger = screen.getByTestId('trigger');
		open.set(true);
		expect(trigger).toHaveAttribute('data-state', 'open');
		open.set(false);
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders basic aria attributes', () => {
		render(Template);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('renders aria-controls that points to content', () => {
		open.set(true);
		render(Template, {open});
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
