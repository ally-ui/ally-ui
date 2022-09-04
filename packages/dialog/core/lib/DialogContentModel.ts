import {ComponentModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';
import type {
	DialogComponentType,
	DialogRootModel,
	DialogRootModelState,
} from './DialogRootModel';

export interface DialogContentModelOptions {
	forceMount?: boolean;
	/**
	 * Called when focus moves into the content after activation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	onActivateAutoFocus?: (ev: Event) => void;
	/**
	 * Called when focus moves out of the content after deactivation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	onDeactivateAutoFocus?: (ev: Event) => void;
	/**
	 * Called when the escape key is down. It can be prevented by calling
	 * `ev.preventDefault`.
	 */
	onEscapeKeyDown?: (ev: KeyboardEvent) => void;
	/**
	 * Called when an interaction (mouse or touch) occurs outside of the content.
	 * It can be prevented by calling `ev.preventDefault`.
	 */
	onInteractOutside?: (ev: MouseEvent | TouchEvent) => void;
}

export interface DialogContentModelReactive {}

export type DialogContentModelState = DialogContentModelOptions &
	DialogContentModelReactive;

export interface DialogContentModelDerived {
	show: boolean;
}

export interface DialogContentModelAttributes {
	id: string;
	role: 'dialog';
	'aria-modal': 'true' | undefined;
	'aria-labelledby': string;
	'aria-describedby': string;
	'data-state': 'open' | 'closed';
}

export class DialogContentModel extends ComponentModel<
	DialogRootModel,
	DialogContentModelState,
	DialogContentModelDerived,
	DialogContentModelAttributes
> {
	getType(): DialogComponentType {
		return 'content';
	}

	deriveState(rootState: DialogRootModelState): DialogContentModelDerived {
		return {
			show: this.state.forceMount || rootState.open,
		};
	}

	getAttributes(rootState: DialogRootModelState): DialogContentModelAttributes {
		return {
			id: this.domId(),
			role: 'dialog',
			'aria-modal': rootState.modal ? 'true' : undefined,
			'aria-labelledby': this.rootModel.componentDomId('title'),
			'aria-describedby': this.rootModel.componentDomId('description'),
			'data-state': rootState.open ? 'open' : 'closed',
		};
	}

	watchStateChange(
		{
			onActivateAutoFocus,
			onDeactivateAutoFocus,
			onEscapeKeyDown,
			onInteractOutside,
		}: DialogContentModelState,
		prevState: DialogContentModelState,
	) {
		// TODO #44 Reduce syncing boilerplate.
		if (onActivateAutoFocus !== prevState.onActivateAutoFocus) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onActivateAutoFocus,
			});
		}
		if (onDeactivateAutoFocus !== prevState.onDeactivateAutoFocus) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onDeactivateAutoFocus,
			});
		}
		if (onEscapeKeyDown !== prevState.onEscapeKeyDown) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onEscapeKeyDown,
			});
		}
		if (onInteractOutside !== prevState.onInteractOutside) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onInteractOutside,
			});
		}
	}

	#contentTrap?: FocusTrapModel;
	/**
	 * Open content and trap focus if possible.
	 * @param open The new open state.
	 * @returns Whether content is waiting to open.
	 */
	onOpenChangeEffect(open: boolean): boolean {
		if (open) {
			return this.#onOpenChangeEffect__handleOpen();
		} else {
			return this.#onOpenChangeEffect__handleClose();
		}
	}

	#onOpenChangeEffect__handleOpen = (): boolean => {
		const content = this.rootModel.findComponent(
			(c) => c.type === 'content' && c.node !== undefined,
		);
		if (content?.node === undefined) {
			if (this.debug) {
				console.error(
					`#onOpenChangeEffect(true), no content component with node`,
				);
			}
			return true;
		}
		this.#contentTrap = this.#onOpenChangeEffect__createFocusTrap(content.node);
		return false;
	};

	#onOpenChangeEffect__createFocusTrap = (contentElement: HTMLElement) => {
		const contentTrap = new FocusTrapModel({
			container: contentElement,
			initialActive: true,
			onActivateAutoFocus: this.state.onActivateAutoFocus,
			onDeactivateAutoFocus: this.state.onDeactivateAutoFocus,
			onEscapeKeyDown: this.state.onEscapeKeyDown,
			onInteractOutside: this.state.onInteractOutside,
		});
		contentTrap.requestStateUpdate = (trapUpdater) => {
			this.rootModel.requestStateUpdate?.((prevState) => {
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
		const triggerComponent = this.rootModel.findComponent(
			(c) => c.type === 'trigger',
		);
		return triggerComponent?.node;
	};

	#onOpenChangeEffect__handleClose = (): boolean => {
		if (this.#contentTrap === undefined) {
			return false;
		}
		this.#contentTrap.deactivate();
		this.#contentTrap = undefined;
		return false;
	};
}
