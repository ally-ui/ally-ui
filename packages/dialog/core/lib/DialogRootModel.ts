import {ComponentModel, RootModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';

export type DialogComponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

export interface DialogRootModelOptions {
	initialOpen?: boolean;
	modal?: boolean;
	clickOutsideDeactivates?: boolean | ((ev: MouseEvent) => boolean);
	escapeDeactivates?: boolean | ((ev: KeyboardEvent) => boolean);
	returnFocusTo?: HTMLElement | (() => HTMLElement | undefined);
}

export interface DialogRootModelReactive {
	open: boolean;
}

export type DialogRootModelState = DialogRootModelOptions &
	DialogRootModelReactive;

export class DialogRootModel extends RootModel<
	DialogComponentType,
	DialogRootModelState
> {
	constructor(id: string, initialOptions: DialogRootModelOptions) {
		super(id, {
			...initialOptions,
			modal: initialOptions.modal ?? true,
			open: initialOptions.initialOpen ?? false,
		});
		if (this.initialState.open) {
			this.#onOpenChangeEffect(true);
		}
	}

	watchBind(component: ComponentModel) {
		if (component.type === 'content') {
			this.#checkTitleInContent();
			if (this.#waitingToOpen) {
				this.#onOpenChangeEffect(true);
			}
		}
	}

	static MISSING_TITLE_WARNING = `<Dialog.Content/> should contain a visible <Dialog.Title/> component.
This provides the user with a recognizable name for the dialog by enforcing an element with \`aria-labelledby\` exists in the dialog.`;

	#checkTitleInContent() {
		const title = this.findComponent((c) => c.type === 'title');
		if (title === undefined) {
			console.warn(DialogRootModel.MISSING_TITLE_WARNING);
		}
	}

	watchStateChange(
		{
			open,
			clickOutsideDeactivates,
			escapeDeactivates,
			returnFocusTo,
		}: DialogRootModelState,
		prevState: DialogRootModelState,
	) {
		if (open !== prevState.open) {
			this.#onOpenChangeEffect(open);
		}
		if (clickOutsideDeactivates !== prevState.clickOutsideDeactivates) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				clickOutsideDeactivates,
			});
		}
		if (escapeDeactivates !== prevState.escapeDeactivates) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				escapeDeactivates,
			});
		}
		if (returnFocusTo !== prevState.returnFocusTo) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				returnFocusTo,
			});
		}
	}

	#waitingToOpen = false;
	#contentTrap?: FocusTrapModel;
	#onOpenChangeEffect(open: boolean) {
		if (open) {
			this.#onOpenChangeEffect__handleOpen();
		} else {
			this.#onOpenChangeEffect__handleClose();
		}
	}

	#onOpenChangeEffect__handleOpen = () => {
		const content = this.findComponent(
			(c) => c.type === 'content' && c.node !== undefined,
		);
		if (content?.node === undefined) {
			if (this.debug) {
				console.error(
					`#onOpenChangeEffect(true), no content component with node`,
				);
			}
			this.#waitingToOpen = true;
			return;
		}
		this.#waitingToOpen = false;
		this.#contentTrap = this.#onOpenChangeEffect__createFocusTrap(content.node);
	};

	#onOpenChangeEffect__createFocusTrap = (contentElement: HTMLElement) => {
		const contentTrap = new FocusTrapModel({
			container: contentElement,
			initialActive: true,
			clickOutsideDeactivates: this.state.clickOutsideDeactivates,
			escapeDeactivates: this.state.escapeDeactivates,
			returnFocusTo:
				this.state.returnFocusTo ?? this.#onOpenChangeEffect__getTriggerNode,
		});
		contentTrap.requestStateUpdate = (trapUpdater) => {
			this.requestStateUpdate?.((prevState) => {
				const trapState =
					trapUpdater instanceof Function
						? trapUpdater(contentTrap.state)
						: trapUpdater;
				return {
					...prevState,
					open: trapState.active,
				};
			});
		};
		return contentTrap;
	};

	#onOpenChangeEffect__getTriggerNode = () => {
		const triggerComponent = this.findComponent((c) => c.type === 'trigger');
		return triggerComponent?.node;
	};

	#onOpenChangeEffect__handleClose = () => {
		this.#waitingToOpen = false;
		if (this.#contentTrap === undefined) {
			return;
		}
		this.#contentTrap.deactivate();
		this.#contentTrap = undefined;
	};
}
