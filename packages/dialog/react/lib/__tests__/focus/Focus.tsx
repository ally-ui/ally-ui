import React from 'react';
import {Dialog, useDialog} from '../../main';
import {UseDialogOptions} from '../../useDialog';

export default function Focus(options: UseDialogOptions) {
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

// it('traps focus in the dialog if initially open', async () => {
// 	render(<FocusTemplate initialOpen />);
// 	const content = await screen.findByTestId('content');
// 	expect(content).toHaveFocusWithin();
// });

// it('traps focus in the dialog on open', async () => {
// 	const user = userEvent.setup();
// 	render(<Focus />);
// 	await user.click(await screen.findByTestId('trigger'));
// 	const content = await screen.findByTestId('content');
// 	expect(content).toHaveFocusWithin();
// });
