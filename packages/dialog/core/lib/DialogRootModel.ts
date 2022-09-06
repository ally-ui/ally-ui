import {RootModel, type ComponentModel} from '@ally-ui/core';
import type {DialogContentModel} from './DialogContentModel';

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
		if (this.initialState.open) {
			this.#onOpenChangeEffect(true);
		}
	}

	watchBind(component: ComponentModel) {
		if (component.type === 'content') {
			this.#checkTitleInContent();
			if (this.#waitingToOpen) {
				this.#onOpenChangeEffect(true);
			}
		}
	}

	static MISSING_TITLE_WARNING = `<Dialog.Content/> should contain a visible <Dialog.Title/> component.
This provides the user with a recognizable name for the dialog by enforcing an element with \`aria-labelledby\` exists in the dialog.`;

	#checkTitleInContent() {
		const title = this.findComponent((c) => c.type === 'title');
		if (title === undefined) {
			console.warn(DialogRootModel.MISSING_TITLE_WARNING);
		}
	}

	#waitingToOpen = false;
	watchStateChange({open}: DialogRootModelState, prev: DialogRootModelState) {
		if (open !== prev.open) {
			this.#onOpenChangeEffect(open);
		}
	}

	#onOpenChangeEffect(open: boolean) {
		const content = this.findComponent<DialogContentModel>(
			(c) => c.type === 'content',
		);
		if (content === undefined) {
			this.#waitingToOpen = open;
		} else if (open) {
			this.#waitingToOpen = !content.open();
		} else {
			this.#waitingToOpen = false;
			content.close();
		}
	}
}
