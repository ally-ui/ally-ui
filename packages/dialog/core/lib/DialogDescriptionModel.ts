import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogDescriptionModelOptions {}

export interface DialogDescriptionModelState {}

export interface DialogDescriptionModelAttributes {
	id: string;
}

export class DialogDescriptionModel extends ComponentModel<
	DialogRootModel,
	DialogDescriptionModelOptions,
	DialogDescriptionModelState,
	DialogDescriptionModelAttributes
> {
	deriveInitialState(): DialogDescriptionModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'description';
	}

	getAttributes(): DialogDescriptionModelAttributes {
		return {
			id: this.domId(),
		} as const;
	}
}
