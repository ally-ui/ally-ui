import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogDescriptionModelOptions {}

export interface DialogDescriptionModelReactive {}

export type DialogDescriptionModelState = DialogDescriptionModelOptions &
	DialogDescriptionModelReactive;

export interface DialogDescriptionModelDerived {}

export interface DialogDescriptionModelAttributes {
	id: string;
}

export class DialogDescriptionModel extends ComponentModel<
	DialogRootModel,
	DialogDescriptionModelState,
	DialogDescriptionModelDerived,
	DialogDescriptionModelAttributes
> {
	getType(): DialogComponentType {
		return 'description';
	}

	getAttributes(): DialogDescriptionModelAttributes {
		return {
			id: this.domId(),
		} as const;
	}
}
