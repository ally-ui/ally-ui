import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel} from './DialogRootModel';

export interface DialogDescriptionModelProps {}
export interface DialogDescriptionModelState {}
export interface DialogDescriptionModelEvents {}
export interface DialogDescriptionModelAttributes {
	id: string;
}

export class DialogDescriptionModel extends NodeComponentModel<
	DialogDescriptionModelProps,
	DialogDescriptionModelState,
	DialogDescriptionModelEvents,
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
