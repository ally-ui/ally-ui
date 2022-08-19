import {DevOptions, findLastInMap, StateModel} from '@ally-ui/core';
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
		initialOptions: DialogModelOptions,
		devOptions?: DevOptions,
	) {
		super(id, initialOptions, devOptions);
		if (this.initialState.open) {
			this.#onOpenChangeEffect_true();
		}
	}

	deriveInitialState(options: DialogModelOptions): DialogModelState {
		return {
			open: options.initialOpen ?? false,
		};
	}

	#components = new Map<string, DialogComponent>();

	init(type: DialogComponentType): string {
		this.#components.set(type, {id: type, type});
		return type;
	}

	deinit(componentId: string, type: DialogComponentType) {
		const component = this.#components.get(componentId);
		if (component === undefined || component.type !== type) {
			if (this.debug) {
				console.error(`deinit(${componentId}, ${type}), not found`);
			}
			return;
		}
		this.#components.delete(componentId);
	}

	bindNode(componentId: string, node: HTMLElement) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`bindNode(${componentId}, ${node}), not initialized`);
			}
			return;
		}
		component.node = node;
	}

	unbindNode(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`unbindNode(${componentId}), not initialized`);
			}
			return;
		}
		delete component.node;
	}

	#rootId() {
		return `dialog${this.id}`;
	}

	#componentId(type: DialogComponentType) {
		return `${this.#rootId()}${type}`;
	}

	componentAttributes(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
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
					'data-state': this.getState().open ? 'open' : 'closed',
				} as const;
			case 'trigger':
				return {
					id: this.#componentId(component.type),
					'aria-haspopup': 'dialog',
					'aria-controls': this.#componentId('content'),
					'data-state': this.getState().open ? 'open' : 'closed',
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

	#contentTrap?: FocusTrapModel;
	async #onOpenChangeEffect(open: boolean) {
		if (open) {
			await this.#onOpenChangeEffect_true();
		} else {
			this.#onOpenChangeEffect_false();
		}
	}

	async #onOpenChangeEffect_true() {
		// Flush changes to the DOM before looking for the content node in DOM.
		await this.uiOptions?.flushDOM?.();
		const content = findLastInMap(
			this.#components,
			(s) => s.type === 'content' && s.node !== undefined,
		);
		if (content?.node === undefined) {
			if (this.debug) {
				console.error(
					`#onOpenChangeEffect(true), no content component with node`,
				);
			}
			return;
		}
		this.#contentTrap = this.#createFocusTrap(content.node);
	}

	#createFocusTrap(contentElement: HTMLElement) {
		const triggerComponent = findLastInMap(
			this.#components,
			(s) => s.type === 'trigger',
		);
		const contentTrap = new FocusTrapModel(this.id, {
			container: contentElement,
			active: true,
			returnFocusTo: triggerComponent?.node,
		});
		contentTrap.setUIOptions(this.uiOptions);
		contentTrap.setOptions((prevOptions) => ({
			...prevOptions,
			onStateChange: (updater) => {
				this.options.onStateChange?.((oldState) => {
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
	}

	#onOpenChangeEffect_false() {
		if (this.#contentTrap === undefined) {
			return;
		}
		this.#contentTrap.deactivate();
		this.#contentTrap = undefined;
	}
}
