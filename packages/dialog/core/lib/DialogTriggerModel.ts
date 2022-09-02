import {ComponentModel} from '@ally-ui/core';
import type {
	DialogComponentType,
	DialogRootModel,
	DialogRootModelOptions,
	DialogRootModelReactive,
} from './DialogRootModel';

export interface DialogTriggerModelOptions {}

export interface DialogTriggerModelReactive {}

export type DialogTriggerModelState = DialogTriggerModelOptions &
	DialogTriggerModelReactive;

export interface DialogTriggerModelDerived {}

export interface DialogTriggerModelAttributes {
	id: string;
	'aria-haspopup': 'dialog';
	'aria-controls': string;
	'data-state': 'open' | 'closed';
}

export class DialogTriggerModel extends ComponentModel<
	DialogRootModel,
	DialogTriggerModelState,
	DialogTriggerModelDerived,
	DialogTriggerModelAttributes
> {
	getType(): DialogComponentType {
		return 'trigger';
	}

	getAttributes(
		rootState: DialogRootModelOptions & DialogRootModelReactive,
	): DialogTriggerModelAttributes {
		return {
			id: this.domId(),
			'aria-haspopup': 'dialog',
			'aria-controls': this.rootModel.componentDomId('content'),
			'data-state': rootState.open ? 'open' : 'closed',
		};
	}

	onClick() {
		this.rootModel.requestStateUpdate?.((prevState) => ({
			...prevState,
			open: true,
		}));
	}
}
