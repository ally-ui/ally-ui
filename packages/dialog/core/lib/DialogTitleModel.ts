import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogTitleModelOptions {}

export interface DialogTitleModelState {}

export class DialogTitleModel extends ComponentModel<
	DialogRootModel,
	DialogTitleModelOptions,
	DialogTitleModelState
> {
	deriveInitialState(): DialogTitleModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'title';
	}

	getAttributes() {
		return {
			id: this.domId(),
		} as const;
	}
}
