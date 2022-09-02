import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogTitleModelOptions {}

export interface DialogTitleModelReactive {}

export type DialogTitleModelState = DialogTitleModelOptions &
	DialogTitleModelReactive;

export interface DialogTitleModelDerived {}

export interface DialogTitleModelAttributes {
	id: string;
}

export class DialogTitleModel extends ComponentModel<
	DialogRootModel,
	DialogTitleModelState,
	DialogTitleModelDerived,
	DialogTitleModelAttributes
> {
	getType(): DialogComponentType {
		return 'title';
	}

	getAttributes(): DialogTitleModelAttributes {
		return {
			id: this.domId(),
		};
	}
}
