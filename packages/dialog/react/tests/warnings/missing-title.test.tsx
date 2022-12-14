import {DialogContentModel} from '@ally-ui/core-dialog';
import {cleanup, render, screen} from '@testing-library/react';
import React from 'react';
import * as Dialog from '../../lib/main';

function MissingTitle() {
	return (
		<React.StrictMode>
			<Dialog.Root initialOpen>
				<Dialog.Trigger data-testid="trigger">open dialog</Dialog.Trigger>
				<Dialog.Content data-testid="content">
					<Dialog.Description data-testid="description">
						description
					</Dialog.Description>
					<Dialog.Close data-testid="close">close dialog</Dialog.Close>
				</Dialog.Content>
			</Dialog.Root>
		</React.StrictMode>
	);
}

afterEach(() => {
	cleanup();
});

it('warns the user if the title component is missing', async () => {
	const warnSpy = vi.spyOn(console, 'warn');
	render(<MissingTitle />);
	await screen.findByTestId('content');
	expect(warnSpy).toHaveBeenCalledWith(
		DialogContentModel.MISSING_TITLE_WARNING,
	);
});
