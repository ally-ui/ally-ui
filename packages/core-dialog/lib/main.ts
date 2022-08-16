import {StatefulModel, findInMap} from '@ally-ui/core';
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
	mounted: boolean;
	ref?: HTMLElement;
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

	init(id: string, type: DialogSubmodelType): string {
		this.#submodels.set(id, {id, type, mounted: false});
		return id;
	}

	deinit(submodelId: string, type: DialogSubmodelType) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined || submodel.type !== type) {
			throw new Error(`deinit(${submodelId}, ${type}), not found`);
		}
		this.#submodels.delete(submodelId);
	}

	mount(submodelId: string, ref?: HTMLElement) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`mount(${submodelId}, ${ref}), not initialized`);
		}
		submodel.mounted = true;
		submodel.ref = ref;
	}

	unmount(submodelId: string) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`unmount(${submodelId}), not initialized`);
		}
		submodel.mounted = false;
		delete submodel.ref;
	}

	#rootDOMId() {
		return `DialogModel${this.id}`;
	}

	#submodelDOMId(submodel?: DialogSubmodel) {
		if (submodel === undefined) {
			return undefined;
		}
		return `${this.#rootDOMId()}-${submodel.type}${submodel.id}`;
	}

	submodelDOMAttributes(submodelId: string) {
		const submodel = this.#submodels.get(submodelId);
		if (submodel === undefined) {
			throw new Error(`getAttributes(${submodelId}), not initialized`);
		}
		switch (submodel.type) {
			case 'content':
				const titleSubmodel = findInMap(
					this.#submodels,
					(s) => s.type === 'title',
				);
				const descriptionSubmodel = findInMap(
					this.#submodels,
					(s) => s.type === 'description',
				);
				return {
					id: this.#submodelDOMId(submodel),
					role: 'dialog',
					'aria-modal': true,
					'aria-labelledby': this.#submodelDOMId(titleSubmodel),
					'aria-describedby': this.#submodelDOMId(descriptionSubmodel),
				};
			default:
				return {
					id: this.#submodelDOMId(submodel),
				};
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
		const content = findInMap(
			this.#submodels,
			(s) => s.type === 'content' && s.mounted,
		);
		if (content === undefined) {
			throw new Error(`#openEffect(${open}), no mounted content subcomponent`);
		}
		// Flush changes to the DOM before looking for the content ref in DOM.
		await this.uiOptions?.waitForDOM?.();
		if (content.ref === undefined) {
			throw new Error('#openEffect(${open}), no content ref');
		}
		this.#contentTrap = this.#createFocusTrap(content.ref);
	}

	#createFocusTrap(contentElement: HTMLElement) {
		const contentTrap = new FocusTrapModel(this.id, {
			container: contentElement,
			active: true,
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
