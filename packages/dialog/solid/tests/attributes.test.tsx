import {cleanup, render, screen} from 'solid-testing-library';
import Dialog, {DialogRootProps} from '../lib/main';

function Attributes(options: DialogRootProps) {
	return (
		<Dialog.Root {...options}>
			<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
			<Dialog.Content data-testid="content">
				<Dialog.Title data-testid="title">title</Dialog.Title>
				<Dialog.Description data-testid="description">
					description
				</Dialog.Description>
				<Dialog.Close data-testid="close">close dialog</Dialog.Close>
			</Dialog.Content>
		</Dialog.Root>
	);
}

afterEach(() => {
	cleanup();
});

describe('content', () => {
	it('renders the data state attribute on an open dialog', () => {
		render(() => <Attributes initialOpen />);
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(() => <Attributes initialOpen />);
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).toHaveAttribute('aria-modal', 'true');
	});

	it('renders basic aria attributes for a non-modal dialog', () => {
		render(() => <Attributes initialOpen modal={false} />);
		const content = screen.getByTestId('content');
		expect(content).toHaveAttribute('role', 'dialog');
		expect(content).not.toHaveAttribute('aria-modal');
	});

	it('renders aria attributes that point to title and description', () => {
		render(() => <Attributes initialOpen />);
		const content = screen.getByTestId('content');
		const title = screen.getByTestId('title');
		const description = screen.getByTestId('description');
		expect(content).toHaveAttribute('aria-labelledby', title.id);
		expect(content).toHaveAttribute('aria-describedby', description.id);
	});
});

describe('trigger', () => {
	it('renders the data state attribute with a closed dialog', () => {
		render(() => <Attributes />);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'closed');
	});

	it('renders the data state attribute with an open dialog', () => {
		render(() => <Attributes initialOpen />);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('data-state', 'open');
	});

	it('renders basic aria attributes', () => {
		render(() => <Attributes />);
		const trigger = screen.getByTestId('trigger');
		expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
	});

	it('renders aria-controls that points to content', () => {
		render(() => <Attributes initialOpen />);
		const trigger = screen.getByTestId('trigger');
		const content = screen.getByTestId('content');
		expect(trigger).toHaveAttribute('aria-controls', content.id);
	});
});
