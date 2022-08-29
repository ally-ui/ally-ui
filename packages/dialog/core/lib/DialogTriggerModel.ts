import {ComponentModel} from '@ally-ui/core';
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

	getAttributes() {
		return {
			id: this.getId(),
			'aria-haspopup': 'dialog',
			'aria-controls': this.rootModel
				.findComponent((c) => c.type === 'content')
				?.getId(),
			'data-state': this.rootModel.getState().open ? 'open' : 'closed',
		};
	}
}
