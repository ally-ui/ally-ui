import {ComponentModel} from '@ally-ui/core';
import type {DialogComponentType, DialogRootModel} from './DialogRootModel';

export interface DialogDescriptionModelOptions {}

export interface DialogDescriptionModelState {}

export class DialogDescriptionModel extends ComponentModel<
	DialogRootModel,
	DialogDescriptionModelOptions,
	DialogDescriptionModelState
> {
	deriveInitialState(): DialogDescriptionModelState {
		return {};
	}

	getType(): DialogComponentType {
		return 'description';
	}

	getAttributes() {
		return {
			id: this.getId(),
		} as const;
	}
}
