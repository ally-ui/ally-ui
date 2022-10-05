import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogDescriptionModelOptions {}

export interface DialogDescriptionModelReactive {}

export type DialogDescriptionModelState = DialogDescriptionModelOptions &
	DialogDescriptionModelReactive;

export interface DialogDescriptionModelDerived {}

export interface DialogDescriptionModelAttributes {
	id: string;
}

export class DialogDescriptionModel extends NodeComponentModel<
	DialogDescriptionModelState,
	DialogDescriptionModelDerived,
	DialogDescriptionModelAttributes
> {
	id = 'description';

	attributes(): DialogDescriptionModelAttributes {
		const root = this.root as DialogRootModel;
		return {
			id: `${root.id}-${this.id}`,
		};
	}
}
