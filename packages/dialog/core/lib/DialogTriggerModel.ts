import {ComponentModel} from '@ally-ui/core';
import type {
	DialogComponentType,
	DialogRootModel,
	DialogRootModelOptions,
	DialogRootModelState,
} from './DialogRootModel';

export interface DialogTriggerModelOptions {}

export interface DialogTriggerModelState {}

export interface DialogTriggerModelDerived {}

export interface DialogTriggerModelAttributes {
	id: string;
	'aria-haspopup': 'dialog';
	'aria-controls': string;
	'data-state': 'open' | 'closed';
}

export class DialogTriggerModel extends ComponentModel<
	DialogRootModel,
	DialogTriggerModelOptions,
	DialogTriggerModelState,
	DialogTriggerModelDerived,
	DialogTriggerModelAttributes
> {
	getType(): DialogComponentType {
		return 'trigger';
	}

	getAttributes(
		rootState: DialogRootModelOptions & DialogRootModelState,
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
