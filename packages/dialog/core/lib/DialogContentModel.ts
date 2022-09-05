import {ComponentModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';
import {ScrollLockModel} from '@ally-ui/scroll-lock';
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
	onOpenAutoFocus?: (ev: Event) => void;
	/**
	 * Called when focus moves out of the content after deactivation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	onCloseAutoFocus?: (ev: Event) => void;
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
			onOpenAutoFocus,
			onEscapeKeyDown,
			onInteractOutside,
		}: DialogContentModelState,
		prev: DialogContentModelState,
	) {
		// TODO #44 Reduce syncing boilerplate.
		if (onOpenAutoFocus !== prev.onOpenAutoFocus) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onActivateAutoFocus: onOpenAutoFocus,
			});
		}
		// Note that we do not directly sync `onDeactivateAutoFocus` because we
		// handle it manually.
		if (onEscapeKeyDown !== prev.onEscapeKeyDown) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onEscapeKeyDown,
			});
		}
		if (onInteractOutside !== prev.onInteractOutside) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onInteractOutside,
			});
		}
	}

	#contentTrap?: FocusTrapModel;
	#scrollLock?: ScrollLockModel;
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
		if (this.node === undefined) {
			if (this.debug) {
				console.error(
					`#onOpenChangeEffect__handleOpen, no content component with node`,
				);
			}
			return true;
		}
		this.#contentTrap = this.#onOpenChangeEffect__createFocusTrap(this.node);
		this.#scrollLock = this.#onOpenChangeEffect__createScrollLock(this.node);
		return false;
	};

	#onOpenChangeEffect__createFocusTrap = (contentElement: HTMLElement) => {
		const contentTrap = new FocusTrapModel({
			container: contentElement,
			initialActive: true,
			onActivateAutoFocus: this.state.onOpenAutoFocus,
			onDeactivateAutoFocus: this.#onCloseAutoFocus__toTrigger,
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

	#onOpenChangeEffect__createScrollLock = (contentElement: HTMLElement) => {
		const scrollLock = new ScrollLockModel({
			container: contentElement,
			initialActive: true,
		});
		scrollLock.requestStateUpdate = (lockUpdater) => {
			this.rootModel.requestStateUpdate?.((prevState) => {
				const lockState =
					lockUpdater instanceof Function
						? lockUpdater(scrollLock.state)
						: lockUpdater;
				return {
					...prevState,
					open: lockState.active,
				};
			});
		};
		return scrollLock;
	};

	#onCloseAutoFocus__toTrigger = (ev: Event) => {
		this.state.onCloseAutoFocus?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		ev.preventDefault();
		const triggerComponent = this.rootModel.findComponent(
			(c) => c.type === 'trigger',
		);
		triggerComponent?.node?.focus();
	};

	#onOpenChangeEffect__handleClose = (): boolean => {
		this.#contentTrap?.deactivate();
		this.#scrollLock?.deactivate();
		this.#contentTrap = undefined;
		this.#scrollLock = undefined;
		return false;
	};
}
