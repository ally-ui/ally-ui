import {$StateOf, ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogTriggerModelOptions {}

export interface DialogTriggerModelState {}

export class DialogTriggerModel extends ComponentModel<
	DialogRootModel,
	DialogTriggerModelOptions,
	DialogTriggerModelState
> {
	deriveInitialState(): DialogTriggerModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'trigger';
	}

	getAttributes(rootState: $StateOf<DialogRootModel>) {
		return {
			id: this.domId(),
			'aria-haspopup': 'dialog',
			'aria-controls': this.rootModel.componentDomId('content'),
			'data-state': rootState.open ? 'open' : 'closed',
		} as const;
	}

	onClick() {
		this.rootModel.getStateOptions().requestStateUpdate?.((prevState) => ({
			...prevState,
			open: true,
		}));
	}
}
