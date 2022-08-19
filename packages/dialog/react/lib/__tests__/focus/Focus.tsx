import React from 'react';
import {Dialog, useDialog} from '../../main';
import {UseDialogOptions} from '../../useDialog';

export default function Focus(options: UseDialogOptions) {
	const dialog = useDialog(options);
	return (
		<React.StrictMode>
			<Dialog.Root model={dialog}>
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
