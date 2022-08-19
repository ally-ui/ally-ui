import {
	cleanup,
	render,
	screen,
	waitForElementToBeRemoved,
} from '@testing-library/svelte';
import {writable, type Writable} from 'svelte/store';
import Attributes from './attributes.test.svelte';

let open: Writable<boolean>;
beforeEach(() => {
	open = writable(true);
});
afterEach(() => {
	cleanup();
});

describe('content', () => {
	it('renders the data state attribute on an open dialog', () => {
		render(Attributes, {initialOpen: true});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(Attributes, {initialOpen: true});
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	});

	it('renders aria attributes that point to title and description', () => {
		render(Attributes, {initialOpen: true});
		const content = screen.getByTestId('content');
		const title = screen.getByTestId('title');
		const description = screen.getByTestId('description');
		expect(content).toHaveAttribute('aria-labelledby', title.id);
		expect(content).toHaveAttribute('aria-describedby', description.id);
	});
});

describe('trigger', () => {
	it('renders the data state attribute with a closed dialog', () => {
		render(Attributes);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders the data state attribute with an open dialog', () => {
		render(Attributes, {initialOpen: true});
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('updates the data state attribute when the dialog opens and closes', async () => {
		render(Attributes, {initialOpen: true, open});
		const trigger = screen.getByTestId('trigger');
		open.set(false);
		await waitForElementToBeRemoved(() => screen.queryByTestId('title'));
		expect(trigger).toHaveAttribute('data-state', 'closed');
		open.set(true);
		await screen.findByTestId('title');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(Attributes);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('renders aria-controls that points to content', () => {
		render(Attributes, {initialOpen: true});
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
