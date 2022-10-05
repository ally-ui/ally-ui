import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogTitleModelProps {}
export interface DialogTitleModelState {}
export interface DialogTitleModelEvents {}
export interface DialogTitleModelAttributes {
	id: string;
}

export class DialogTitleModel extends NodeComponentModel<
	DialogTitleModelProps,
	DialogTitleModelState,
	DialogTitleModelEvents,
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
