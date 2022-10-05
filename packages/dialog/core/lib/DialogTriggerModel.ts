import {NodeComponentModel} from '@ally-ui/core';
import type {DialogRootModel, DialogRootModelState} from './DialogRootModel';
import type {DialogTitleModelAttributes} from './DialogTitleModel';

export interface DialogTriggerModelProps {}
export interface DialogTriggerModelState {}
export interface DialogTriggerModelEvents {}
export interface DialogTriggerModelAttributes {
	id: string;
	'aria-haspopup': 'dialog';
	'aria-controls': string;
	'data-state': 'open' | 'closed';
}

export class DialogTriggerModel extends NodeComponentModel<
	DialogTriggerModelProps,
	DialogTriggerModelState,
	DialogTriggerModelEvents,
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
		root.state.requestUpdate?.((prev) => ({...prev, open: true}));
	}
}
