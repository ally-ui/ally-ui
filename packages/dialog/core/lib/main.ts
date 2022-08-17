import {StatefulModel, findLastInMap} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';

type DialogSubmodelType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

interface DialogSubmodel {
	id: string;
	type: DialogSubmodelType;
	node?: HTMLElement;
}

export interface DialogModelOptions {
	initialOpen?: boolean;
}

export interface DialogModelState {
	open: boolean;
}

export class DialogModel extends StatefulModel<
	DialogModelOptions,
	DialogModelState
> {
	constructor(id: string, initialOptions: DialogModelOptions) {
		super(id, initialOptions);
	}

	deriveInitialState(options: DialogModelOptions): DialogModelState {
		return {
			open: options.initialOpen ?? false,
		};
	}

	#submodels = new Map<string, DialogSubmodel>();

	init(type: DialogSubmodelType): string {
		this.#submodels.set(type, {id: type, type});
		return type;
	}

	deinit(submodelId: string, type: DialogSubmodelType) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined || submodel.type !== type) {
			throw new Error(`deinit(${submodelId}, ${type}), not found`);
		}
		this.#submodels.delete(submodelId);
	}

	bindNode(submodelId: string, node: HTMLElement) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`bindNode(${submodelId}, ${node}), not initialized`);
		}
		submodel.node = node;
	}

	unbindNode(submodelId: string) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`unbindNode(${submodelId}), not initialized`);
		}
		delete submodel.node;
	}

	#DOMId() {
		return `dialog${this.id}`;
	}

	#submodelDOMId(type: DialogSubmodelType) {
		return `${this.#DOMId()}${type}`;
	}

	submodelDOMAttributes(submodelId: string) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`getAttributes(${submodelId}), not initialized`);
		}
		switch (submodel.type) {
			case 'content':
				return {
					id: this.#submodelDOMId(submodel.type),
					role: 'dialog',
					'aria-modal': true,
					'aria-labelledby': this.#submodelDOMId('title'),
					'aria-describedby': this.#submodelDOMId('description'),
					'data-state': this.getState().open ? 'open' : 'closed',
				} as const;
			case 'trigger':
				return {
					id: this.#submodelDOMId(submodel.type),
					'aria-haspopup': 'dialog',
					'aria-controls': this.#submodelDOMId('content'),
					'data-state': this.getState().open ? 'open' : 'closed',
				} as const;
			case 'title':
			case 'description':
				return {
					id: this.#submodelDOMId(submodel.type),
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
		await this.uiOptions?.waitForDOM?.();
		const content = findLastInMap(
			this.#submodels,
			(s) => s.type === 'content' && s.node !== undefined,
		);
		if (content?.node === undefined) {
			throw new Error(
				`#onOpenChangeEffect(true), no content submodel with node`,
			);
		}
		this.#contentTrap = this.#createFocusTrap(content.node);
	}

	#createFocusTrap(contentElement: HTMLElement) {
		const triggerSubmodel = findLastInMap(
			this.#submodels,
			(s) => s.type === 'trigger',
		);
		const contentTrap = new FocusTrapModel(this.id, {
			container: contentElement,
			active: true,
			returnFocusTo: triggerSubmodel?.node,
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
