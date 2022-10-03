import {ComponentModel, NodeModel} from '@ally-ui/core';
import {FocusTrapModel} from '@ally-ui/focus-trap';
import {ScrollLockModel} from '@ally-ui/scroll-lock';
import type {DialogRootModel, DialogRootModelState} from './DialogRootModel';
import type {DialogTitleModel as DialogTriggerModel} from './DialogTitleModel';

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
	'aria-modal'?: 'true';
	'aria-labelledby': string;
	'aria-describedby': string;
	'data-state': 'open' | 'closed';
	style?: Record<string, string>;
}

export class DialogContentModel extends NodeModel<
	DialogContentModelState,
	DialogContentModelDerived,
	DialogContentModelAttributes
> {
	id = 'content';

	derived(rootState: DialogRootModelState): DialogContentModelDerived {
		return {
			show: this.state.forceMount || rootState.open,
		};
	}

	attributes(rootState: DialogRootModelState): DialogContentModelAttributes {
		const root = this.root as DialogRootModel;
		const style: Record<string, string> = {};
		if (rootState.modal) {
			style['pointer-events'] = 'auto';
		}
		return {
			id: `${root.id}-${this.id}`,
			role: 'dialog',
			'aria-modal': rootState.modal ? 'true' : undefined,
			'aria-labelledby': `${root.id}-title`,
			'aria-describedby': `${root.id}-description`,
			'data-state': rootState.open ? 'open' : 'closed',
			style,
		};
	}

	#unsubscribeState?: () => void;
	#unsubscribeRootState?: () => void;
	onMount(): void {
		super.onMount();
		this.#unsubscribeState = this.subscribeState(this.#onStateChange);
		this.#unsubscribeRootState = this.root.subscribeState(
			this.#onRootStateChange,
		);
	}

	onUnmount(): void {
		super.onUnmount();
		this.#unsubscribeState?.();
		this.#unsubscribeRootState?.();
	}

	#onStateChange = (
		{
			onOpenAutoFocus,
			onEscapeKeyDown,
			onInteractOutside,
		}: DialogContentModelState,
		prev?: DialogContentModelState,
	) => {
		// TODO #44 Reduce syncing boilerplate.
		if (onOpenAutoFocus !== prev?.onOpenAutoFocus) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onActivateAutoFocus: onOpenAutoFocus,
			});
		}
		// Note that we do not directly sync `onDeactivateAutoFocus` because we
		// handle it manually.
		if (onEscapeKeyDown !== prev?.onEscapeKeyDown) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onEscapeKeyDown,
			});
		}
		if (onInteractOutside !== prev?.onInteractOutside) {
			this.#contentTrap?.setState({
				...this.#contentTrap.state,
				onInteractOutside,
			});
		}
	};

	#onRootStateChange = (
		{open}: DialogRootModelState,
		prev?: DialogRootModelState,
	) => {
		if (open !== prev?.open) {
			if (open) {
				this.open();
			} else {
				this.close();
			}
		}
	};

	onBind(node: HTMLElement): void {
		super.onBind(node);
		this.#checkTitle();
		const root = this.root as DialogRootModel;
		if (root.state.open) {
			this.open();
		}
	}

	#checkTitle() {
		const title = this.root.findChild(this.#isTitle);
		if (title == null) {
			console.warn(DialogContentModel.MISSING_TITLE_WARNING);
		}
	}

	#isTitle = (c: ComponentModel): c is DialogTriggerModel => c.id === 'title';

	static MISSING_TITLE_WARNING = `<Dialog.Content/> should contain a visible <Dialog.Title/> component.
This provides the user with a recognizable name for the dialog by enforcing an element with \`aria-labelledby\` exists in the dialog.`;

	onDeregister(): void {
		super.onDeregister();
		this.close();
	}

	#contentTrap?: FocusTrapModel;
	#scrollLock?: ScrollLockModel;
	/**
	 * Open the content modal.
	 * @returns Whether the content successfully opened.
	 */
	open(): boolean {
		if (this.node == null) {
			if (this.debug) {
				console.error(`open, no content component with node`);
			}
			return false;
		}
		if (this.#contentTrap != null && this.#scrollLock != null) {
			return true;
		}
		this.#contentTrap = this.#createFocusTrap(this.node);
		this.#scrollLock = this.#createScrollLock(this.node);
		return true;
	}

	#createFocusTrap(contentElement: HTMLElement) {
		const contentTrap = new FocusTrapModel({
			initialActive: true,
			onActivateAutoFocus: this.state.onOpenAutoFocus,
			onDeactivateAutoFocus: this.#onDeactivateFocusToTrigger,
			onEscapeKeyDown: this.state.onEscapeKeyDown,
			onInteractOutside: this.state.onInteractOutside,
		});
		// TODO Use better semantics for onBind
		contentTrap.onBind(contentElement);
		const root = this.root as DialogRootModel;
		contentTrap.requestStateUpdate = (trapUpdater) => {
			root.requestStateUpdate?.((prev) => {
				const trapState =
					trapUpdater instanceof Function
						? trapUpdater(contentTrap.state)
						: trapUpdater;
				return {
					...prev,
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
		const trigger = this.root.findChild(this.#isTriggerWithNode);
		trigger?.node?.focus();
	};

	#isTriggerWithNode = (c: ComponentModel): c is DialogTriggerModel =>
		c.id === 'trigger' && (c as DialogTriggerModel).node != null;

	#createScrollLock(contentElement: HTMLElement) {
		const scrollLock = new ScrollLockModel({
			initialActive: true,
		});
		// TODO Use better semantics for onBind
		scrollLock.onBind(contentElement);
		const root = this.root as DialogRootModel;
		scrollLock.requestStateUpdate = (lockUpdater) => {
			root.requestStateUpdate?.((prev) => {
				const lockState =
					lockUpdater instanceof Function
						? lockUpdater(scrollLock.state)
						: lockUpdater;
				return {
					...prev,
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
