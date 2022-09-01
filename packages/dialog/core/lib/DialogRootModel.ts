import {ComponentModel, RootModel, RootOptions} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';

export type DialogComponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

export interface DialogRootModelOptions extends RootOptions {
	initialOpen?: boolean;
	modal?: boolean;
}

export interface DialogRootModelState {
	open: boolean;
	modal: boolean;
}

export class DialogRootModel extends RootModel<
	DialogComponentType,
	DialogRootModelOptions,
	DialogRootModelState
> {
	constructor(id: string, initialOptions: DialogRootModelOptions) {
		super(id, initialOptions);
		if (this.initialState.open) {
			this.#onOpenChangeEffect(true);
		}
	}

	deriveInitialState(
		initialOptions: DialogRootModelOptions,
	): DialogRootModelState {
		return {
			open: initialOptions.initialOpen ?? false,
			modal: initialOptions.modal ?? true,
		};
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
		newState: DialogRootModelState,
		oldState: DialogRootModelState,
	) {
		if (newState.open !== oldState.open) {
			this.#onOpenChangeEffect(newState.open);
		}
	}

	#waitingToOpen = false;
	#contentTrap?: FocusTrapModel;
	async #onOpenChangeEffect(open: boolean) {
		const handleOpen = () => {
			const content = this.findComponent(
				(c) => c.type === 'content' && c.node !== undefined,
			);
			if (content?.node === undefined) {
				if (this.getStateOptions().debug) {
					console.error(
						`#onOpenChangeEffect(true), no content component with node`,
					);
				}
				this.#waitingToOpen = true;
				return;
			}
			this.#waitingToOpen = false;
			this.#contentTrap = createFocusTrap(content.node);
		};

		const createFocusTrap = (contentElement: HTMLElement) => {
			const getTriggerNode = () => {
				const triggerComponent = this.findComponent(
					(c) => c.type === 'trigger',
				);
				return triggerComponent?.node;
			};
			const contentTrap = new FocusTrapModel(this.id, {
				container: contentElement,
				initialActive: true,
				returnFocusTo: getTriggerNode,
			});
			contentTrap.setStateOptions((prevOptions) => ({
				...prevOptions,
				requestStateUpdate: (updater) => {
					this.getStateOptions().requestStateUpdate?.((oldState) => {
						const newFocusTrapState =
							updater instanceof Function
								? updater({active: oldState.open})
								: updater;
						return {
							...oldState,
							open: newFocusTrapState.active,
						};
					});
				},
			}));
			return contentTrap;
		};

		const handleClose = () => {
			this.#waitingToOpen = false;
			if (this.#contentTrap === undefined) {
				return;
			}
			this.#contentTrap.deactivate();
			this.#contentTrap = undefined;
		};

		if (open) {
			handleOpen();
		} else {
			handleClose();
		}
	}
}
