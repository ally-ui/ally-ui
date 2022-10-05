import {ComponentModel} from '@ally-ui/core';

export interface DialogRootModelProps {
	initialOpen?: boolean;
	open?: boolean;
	modal?: boolean;
}

export interface DialogRootModelState {
	open: boolean;
	modal: boolean;
}

export interface DialogRootModelEvents {
	openChange?: (open: boolean) => void;
}

export class DialogRootModel extends ComponentModel<
	DialogRootModelProps,
	DialogRootModelState,
	DialogRootModelEvents
> {
	constructor(
		public id: string,
		initialProps: DialogRootModelProps,
		initialEvents: DialogRootModelEvents,
	) {
		super(initialProps, initialEvents);
	}

	initialState(initialProps: DialogRootModelProps): DialogRootModelState {
		return {
			open: initialProps.open ?? initialProps.initialOpen ?? false,
			modal: initialProps.modal ?? true,
		};
	}
}
