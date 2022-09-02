import {ComponentModel} from '@ally-ui/core';
import type {
	DialogComponentType,
	DialogRootModel,
	DialogRootModelOptions,
	DialogRootModelReactive,
} from './DialogRootModel';

export interface DialogContentModelOptions {
	forceMount?: boolean;
}

export interface DialogContentModelReactive {}

export type DialogContentModelState = DialogContentModelOptions &
	DialogContentModelReactive;

export interface DialogContentModelDerived {
	show: boolean;
}

export interface DialogContentModelAttributes {
	id: string;
	role: 'dialog';
	'aria-modal': 'true' | undefined;
	'aria-labelledby': string;
	'aria-describedby': string;
	'data-state': 'open' | 'closed';
}

export class DialogContentModel extends ComponentModel<
	DialogRootModel,
	DialogContentModelState,
	DialogContentModelDerived,
	DialogContentModelAttributes
> {
	getType(): DialogComponentType {
		return 'content';
	}

	deriveState(
		rootState: DialogRootModelReactive & DialogRootModelOptions,
	): DialogContentModelDerived {
		return {
			show: this.state.forceMount || rootState.open,
		};
	}

	getAttributes(
		rootState: DialogRootModelReactive & DialogRootModelOptions,
	): DialogContentModelAttributes {
		return {
			id: this.domId(),
			role: 'dialog',
			'aria-modal': rootState.modal ? 'true' : undefined,
			'aria-labelledby': this.rootModel.componentDomId('title'),
			'aria-describedby': this.rootModel.componentDomId('description'),
			'data-state': rootState.open ? 'open' : 'closed',
		};
	}
}
