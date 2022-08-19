import {Dialog, useDialog} from '../../main';

export function InitOpenTemplate() {
	const dialog = useDialog({initialOpen: true});
	return (
		<>
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
		</>
	);
}

export function InitClosedTemplate() {
	const dialog = useDialog();
	return (
		<>
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
		</>
	);
}
