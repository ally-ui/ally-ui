import {RootModel} from '@ally-ui/core';

export type DialogComponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

export interface DialogRootModelOptions {
	initialOpen?: boolean;
	modal?: boolean;
}

export interface DialogRootModelReactive {
	open: boolean;
}

export type DialogRootModelState = DialogRootModelOptions &
	DialogRootModelReactive;

export class DialogRootModel extends RootModel<
	DialogComponentType,
	DialogRootModelState
> {
	constructor(id: string, initialOptions: DialogRootModelOptions) {
		super(id, {
			...initialOptions,
			modal: initialOptions.modal ?? true,
			open: initialOptions.initialOpen ?? false,
		});
	}
}
