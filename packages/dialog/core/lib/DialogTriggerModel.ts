import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel, DialogRootModelState} from './DialogRootModel';
import type {DialogTitleModelAttributes} from './DialogTitleModel';

export interface DialogTriggerModelOptions {}

export interface DialogTriggerModelReactive {}

export type DialogTriggerModelState = DialogTriggerModelOptions &
	DialogTriggerModelReactive;

export interface DialogTriggerModelDerived {}

export interface DialogTriggerModelAttributes {
	id: string;
	'aria-haspopup': 'dialog';
	'aria-controls': string;
	'data-state': 'open' | 'closed';
}

export class DialogTriggerModel extends NodeComponentModel<
	DialogTriggerModelState,
	DialogTriggerModelDerived,
	DialogTitleModelAttributes
> {
	id = 'trigger';

	attributes(rootState: DialogRootModelState): DialogTriggerModelAttributes {
		const root = this.root as DialogRootModel;
		return {
			id: `${root.id}-${this.id}`,
			'aria-haspopup': 'dialog',
			'aria-controls': `${root.id}-content`,
			'data-state': rootState.open ? 'open' : 'closed',
		};
	}

	onClick() {
		const root = this.root as DialogRootModel;
		root.requestStateUpdate?.((prev) => ({...prev, open: true}));
	}
}
