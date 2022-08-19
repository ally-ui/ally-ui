import {
	cleanup,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/svelte';
import {writable} from 'svelte/store';
import Template from './template.svelte';

const open = writable(true);
beforeEach(() => {
	open.set(true);
});
afterEach(() => {
	cleanup();
});

describe('content', () => {
	it('renders the data state attribute on an open dialog', () => {
		render(Template, {initialOpen: true});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(Template, {initialOpen: true});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	});

	it('renders aria attributes that point to title and description', () => {
		render(Template, {initialOpen: true});
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
		render(Template, {initialOpen: true});
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('updates the data state attribute when the dialog opens and closes', async () => {
		render(Template, {initialOpen: true, open});
		const trigger = screen.getByTestId('trigger');
		open.set(false);
		await waitForElementToBeRemoved(() => screen.queryByTestId('title'));
		expect(trigger).toHaveAttribute('data-state', 'closed');
		open.set(true);
		await screen.findByTestId('title');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(Template);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('renders aria-controls that points to content', () => {
		render(Template, {initialOpen: true});
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
