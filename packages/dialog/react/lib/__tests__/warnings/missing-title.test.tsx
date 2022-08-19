import {cleanup, render} from '@testing-library/react';
import React from 'react';
import {vi} from 'vitest';
import {Dialog, useDialog} from '../../main';

function MissingTitle() {
	const dialog = useDialog({initialOpen: true});
	return (
		<React.StrictMode>
			<Dialog.Root model={dialog}>
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
	expect(warnSpy).toHaveBeenCalledWith(
		'Dialogs should contain a title component for accessibility reasons',
	);
});
