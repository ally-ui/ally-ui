import {findLastInMap, ResolvedOptions, StateModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';

type DialogComponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

interface DialogComponent {
	id: string;
	type: DialogComponentType;
	mounted: boolean;
	node?: HTMLElement;
}

export interface DialogModelOptions {
	initialOpen?: boolean;
}

export interface DialogModelState {
	open: boolean;
}

export class DialogModel extends StateModel<
	DialogModelOptions,
	DialogModelState
> {
	constructor(
		id: string,
		initialOptions: ResolvedOptions<DialogModelOptions, DialogModelState>,
	) {
		super(id, initialOptions);
		if (this.initialState.open) {
			this.#onOpenChangeEffect(true);
		}
	}

	deriveInitialState(options: DialogModelOptions): DialogModelState {
		return {
			open: options.initialOpen ?? false,
		};
	}

	#components = new Map<string, DialogComponent>();

	/**
	 * Initialize a component of the model. This should run before the component
	 * is mounted and before a reference to the DOM is obtained.
	 * @param type The type of component being initialized.
	 * @returns The assigned ID for the component.
	 */
	init(type: DialogComponentType): string {
		this.#components.set(type, {id: type, type, mounted: false});
		return type;
	}

	deinit(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`deinit(${componentId}), not found`);
			}
			return;
		}
		this.#components.delete(componentId);
	}

	/**
	 * Mark a component as mounted. This signals when a component has completed
	 * its initialization phase and is ready to receive events.
	 * @param componentId The ID of the component to mount.
	 */
	mount(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`mount(${componentId}), not initialized`);
			}
			return;
		}
		component.mounted = true;
	}

	unmount(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`unmount(${componentId}), not found`);
			}
			return;
		}
		component.mounted = false;
	}

	/**
	 * Save a reference to the DOM node that the component abstracts over.
	 * @param componentId The ID of the component that holds the node reference.
	 * @param node The DOM node reference.
	 */
	bindNode(componentId: string, node: HTMLElement) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`bindNode(${componentId}, ${node}), not initialized`);
			}
			return;
		}
		component.node = node;
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
		const title = findLastInMap(this.#components, (c) => c.type === 'title');
		if (title === undefined) {
			console.warn(DialogModel.MISSING_TITLE_WARNING);
		}
	}

	unbindNode(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`unbindNode(${componentId}), not initialized`);
			}
			return;
		}
		delete component.node;
	}

	#rootId() {
		return `ally-${this.id}`;
	}

	#componentId(type: DialogComponentType) {
		return `${this.#rootId()}-${type}`;
	}

	/**
	 * Get the required DOM attributes for a component with a given state.
	 * @param componentId The component to get attributes for.
	 * @param state If the component attributes are static, this can be omitted.
	 * @returns An object describing the DOM attributes to apply to the component node.
	 */
	componentAttributes(componentId: string, state?: DialogModelState) {
		const resolvedState = state ?? this.getState();
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.options.debug) {
				console.error(`getAttributes(${componentId}), not initialized`);
			}
			return;
		}
		switch (component.type) {
			case 'content':
				return {
					id: this.#componentId(component.type),
					role: 'dialog',
					'aria-modal': 'true',
					'aria-labelledby': this.#componentId('title'),
					'aria-describedby': this.#componentId('description'),
					'data-state': resolvedState.open ? 'open' : 'closed',
				} as const;
			case 'trigger':
				return {
					id: this.#componentId(component.type),
					'aria-haspopup': 'dialog',
					'aria-controls': this.#componentId('content'),
					'data-state': resolvedState.open ? 'open' : 'closed',
				} as const;
			case 'title':
			case 'description':
				return {
					id: this.#componentId(component.type),
				} as const;
			default:
				return {};
		}
	}

	watchStateChange(newState: DialogModelState, oldState: DialogModelState) {
		if (newState.open !== oldState.open) {
			this.#onOpenChangeEffect(newState.open);
		}
	}

	#waitingToOpen = false;
	#contentTrap?: FocusTrapModel;
	async #onOpenChangeEffect(open: boolean) {
		const handleOpen = () => {
			const content = findLastInMap(
				this.#components,
				(c) => c.type === 'content' && c.node !== undefined,
			);
			if (content?.node === undefined) {
				if (this.options.debug) {
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
				const triggerComponent = findLastInMap(
					this.#components,
					(c) => c.type === 'trigger',
				);
				return triggerComponent?.node;
			};
			const contentTrap = new FocusTrapModel(this.id, {
				container: contentElement,
				initialActive: true,
				returnFocusTo: getTriggerNode,
			});
			contentTrap.setUIOptions(this.uiOptions);
			contentTrap.setOptions((prevOptions) => ({
				...prevOptions,
				requestStateUpdate: (updater) => {
					this.options.requestStateUpdate?.((oldState) => {
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

		// Flush changes to the DOM before looking for nodes in DOM.
		await this.uiOptions?.flushDOM?.();
		if (open) {
			handleOpen();
		} else {
			handleClose();
		}
	}

	// TODO How should we indicate that these methods should be attached to event listeners?
	onTriggerClick() {
		this.options.requestStateUpdate?.((prevState) => ({
			...prevState,
			open: true,
		}));
	}

	onCloseClick() {
		this.options.requestStateUpdate?.((prevState) => ({
			...prevState,
			open: false,
		}));
	}
}
