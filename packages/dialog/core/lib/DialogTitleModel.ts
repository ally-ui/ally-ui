import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogTitleModelOptions {}

export interface DialogTitleModelState {}

export interface DialogTitleModelAttributes {
	id: string;
}

export class DialogTitleModel extends ComponentModel<
	DialogRootModel,
	DialogTitleModelOptions,
	DialogTitleModelState,
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
