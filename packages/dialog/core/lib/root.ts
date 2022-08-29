import {ComponentModel, RootModel, RootOptions} from '@ally-ui/core';
import type {DialogModelState} from './main';

export type DialogComponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

export interface DialogRootModelOptions extends RootOptions {
	initialOpen?: boolean;
}

export interface DialogRootModelState {
	open: boolean;
}

export class DialogRootModel extends RootModel<
	DialogComponentType,
	DialogRootModelOptions,
	DialogRootModelState
> {
	constructor(id: string, initialOptions: DialogRootModelOptions) {
		super(id, initialOptions);
		if (this.initialState.open) {
			// TODO #17 Run open change effect.
		}
	}

	static MISSING_TITLE_WARNING = `<Dialog.Content/> should contain a visible <Dialog.Title/> component.
This provides the user with a recognizable name for the dialog by enforcing an element with \`aria-labelledby\` exists in the dialog.`;

	watchBind(component: ComponentModel) {
		if (component.type === 'content') {
			// TODO #17 Check for title in content.
			// TODO #17 Check for waitingToOpen
		}
	}

	watchStateChange(newState: DialogModelState, oldState: DialogModelState) {
		if (newState.open !== oldState.open) {
			//TODO #17 Run open change effect.
		}
	}

	#waitingToOpen = false;
	#contentTrap?: FocusTrapModel;
	async #onOpenChangeEffect(open: boolean) {}
}
