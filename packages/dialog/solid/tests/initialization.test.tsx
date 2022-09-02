import {cleanup, render, screen} from 'solid-testing-library';
import Dialog, {DialogRootProps} from '../lib/main';

function Initialization(options: DialogRootProps) {
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

it('hides an initially closed dialog', () => {
	render(() => <Initialization />);
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('shows an initially opened dialog', () => {
	render(() => <Initialization initialOpen />);
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
