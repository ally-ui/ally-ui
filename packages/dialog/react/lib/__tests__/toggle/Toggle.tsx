import React from 'react';
import {Dialog, useDialog} from '../../main';
import {UseDialogOptions} from '../../useDialog';

export default function Toggle(options: UseDialogOptions) {
	const dialog = useDialog(options);
	return (
		<React.StrictMode>
			<Dialog.Trigger model={dialog} data-testid="trigger">
				open dialog
			</Dialog.Trigger>
			<Dialog.Content model={dialog} data-testid="content">
				<Dialog.Title model={dialog} data-testid="title">
					title
				</Dialog.Title>
				<Dialog.Description model={dialog} data-testid="description">
					description
				</Dialog.Description>
				<Dialog.Close model={dialog} data-testid="close">
					close dialog
				</Dialog.Close>
			</Dialog.Content>
		</React.StrictMode>
	);
}
