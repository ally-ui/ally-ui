import {StatefulModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';

type DialogSubModelType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

interface DialogSubModel {
	id: string;
	type: DialogSubModelType;
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

	#subModelId = 0;
	#getSubModelId() {
		return String(this.#subModelId++);
	}

	#subModels: DialogSubModel[] = [];

	init(type: DialogSubModelType): string {
		const id = this.#getSubModelId();
		this.#subModels.push({id, type, mounted: false});
		return id;
	}

	deinit(type: DialogSubModelType, id: string) {
		const idx = this.#subModels.findIndex(
			(s) => s.type === type && s.id === id,
		);
		if (idx === -1) {
			throw new Error(`deinit(${type}, ${id}), not found`);
		}
		this.#subModels.splice(idx, 1);
	}

	mount(id: string, ref?: HTMLElement) {
		const subModel = this.#subModels.find((s) => s.id === id);
		if (subModel === undefined) {
			throw new Error(`mount(${id}, ${ref}), not initialized`);
		}
		subModel.mounted = true;
		subModel.ref = ref;
	}

	unmount(id: string) {
		const subModel = this.#subModels.find((s) => s.id === id);
		if (subModel === undefined) {
			throw new Error(`unmount(${id}), not initialized`);
		}
		subModel.mounted = false;
		delete subModel.ref;
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
		const content = this.#subModels.find(
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
		this.#contentTrap = new FocusTrapModel({
			container: content.ref,
			active: true,
		});
		this.#contentTrap.setOptions((prevOptions) => ({
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
	}

	#onOpenChangeEffect_false() {
		if (this.#contentTrap === undefined) {
			return;
		}
		this.#contentTrap.deactivate();
		this.#contentTrap = undefined;
	}
}
