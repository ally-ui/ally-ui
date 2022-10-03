import {ComponentModel} from '@ally-ui/core';

export interface DialogRootModelOptions {
	initialOpen?: boolean;
	modal?: boolean;
}

export interface DialogRootModelReactive {
	open: boolean;
}

export type DialogRootModelState = DialogRootModelOptions &
	DialogRootModelReactive;

export class DialogRootModel extends ComponentModel<DialogRootModelState> {
	constructor(public id: string, initialOptions: DialogRootModelOptions) {
		super({
			...initialOptions,
			modal: initialOptions.modal ?? true,
			open: initialOptions.initialOpen ?? false,
		});
	}
}
