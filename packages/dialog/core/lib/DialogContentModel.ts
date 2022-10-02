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
	style?: Record<string, string>;
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
			...(rootState.modal ? {style: {'pointer-events': 'auto'}} : {}),
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

	watchRootStateChange(
		{open}: DialogRootModelState,
		prev: DialogRootModelState,
	): void {
		if (open !== prev.open) {
			if (open) {
				this.open();
			} else {
				this.close();
			}
		}
	}

	watchBind(): void {
		this.#checkTitle();
		if (this.rootModel.state.open) {
			this.open();
		}
	}

	static MISSING_TITLE_WARNING = `<Dialog.Content/> should contain a visible <Dialog.Title/> component.
This provides the user with a recognizable name for the dialog by enforcing an element with \`aria-labelledby\` exists in the dialog.`;

	#checkTitle() {
		const title = this.rootModel.findComponent((c) => c.type === 'title');
		if (title === undefined) {
			console.warn(DialogContentModel.MISSING_TITLE_WARNING);
		}
	}

	watchDeregister(): void {
		this.close();
	}

	#contentTrap?: FocusTrapModel;
	#scrollLock?: ScrollLockModel;
	/**
	 * Open the content modal.
	 * @returns Whether the content successfully opened.
	 */
	open(): boolean {
		if (this.node === undefined) {
			if (this.debug) {
				console.error(`open, no content component with node`);
			}
			return false;
		}
		if (this.#contentTrap !== undefined && this.#scrollLock !== undefined) {
			return true;
		}
		this.#contentTrap = this.#createFocusTrap(this.node);
		this.#scrollLock = this.#createScrollLock(this.node);
		return true;
	}

	#createFocusTrap(contentElement: HTMLElement) {
		const contentTrap = new FocusTrapModel({
			container: contentElement,
			initialActive: true,
			onActivateAutoFocus: this.state.onOpenAutoFocus,
			onDeactivateAutoFocus: this.#onDeactivateFocusToTrigger,
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
	}

	#onDeactivateFocusToTrigger = (ev: Event) => {
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

	#createScrollLock(contentElement: HTMLElement) {
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
	}

	close() {
		this.#contentTrap?.deactivate();
		this.#scrollLock?.deactivate();
		this.#contentTrap = undefined;
		this.#scrollLock = undefined;
		return true;
	}
}
