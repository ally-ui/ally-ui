import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogTitleModelOptions {}

export interface DialogTitleModelReactive {}

export type DialogTitleModelState = DialogTitleModelOptions &
	DialogTitleModelReactive;

export interface DialogTitleModelDerived {}

export interface DialogTitleModelAttributes {
	id: string;
}

export class DialogTitleModel extends NodeComponentModel<
	DialogTitleModelState,
	DialogTitleModelDerived,
	DialogTitleModelAttributes
> {
	id = 'title';

	attributes(): DialogTitleModelAttributes {
		const root = this.root as DialogRootModel;
		return {
			id: `${root.id}-${this.id}`,
		};
	}
}
