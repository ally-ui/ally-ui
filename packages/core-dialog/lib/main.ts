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
	deriveInitialState(options: DialogModelOptions): DialogModelState {
		return {
			open: options.initialOpen ?? false,
		};
	}

	#submodelId = 0;
	#getSubmodelId() {
		return String(this.#submodelId++);
	}

	#submodels = new Map<string, DialogSubmodel>();

	init(type: DialogSubmodelType): string {
		const id = this.#getSubmodelId();
		this.#submodels.set(id, {id, type, mounted: false});
		return id;
	}

	deinit(type: DialogSubmodelType, id: string) {
		const submodel = this.#submodels.get(id);
		if (submodel === undefined || submodel.type !== type) {
			throw new Error(`deinit(${type}, ${id}), not found`);
		}
		this.#submodels.delete(id);
	}

	mount(id: string, ref?: HTMLElement) {
		const submodel = this.#submodels.get(id);
		if (submodel === undefined) {
			throw new Error(`mount(${id}, ${ref}), not initialized`);
		}
		submodel.mounted = true;
		submodel.ref = ref;
	}

	unmount(id: string) {
		const submodel = this.#submodels.get(id);
		if (submodel === undefined) {
			throw new Error(`unmount(${id}), not initialized`);
		}
		submodel.mounted = false;
		delete submodel.ref;
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
		const contentTrap = new FocusTrapModel({
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
