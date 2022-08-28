import React from 'react';
import Dialog from '../../main';
import type {UseDialogOptions} from '../../useDialog';

export default function Focus(options: UseDialogOptions) {
	return (
		<React.StrictMode>
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
		</React.StrictMode>
	);
}
