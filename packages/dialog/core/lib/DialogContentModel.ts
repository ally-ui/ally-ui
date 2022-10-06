import {
	type ComponentModel,
	NodeComponentModel,
	mergeAttributes,
} from '@ally-ui/core';
import {FocusTrapModel, type FocusTrapModelState} from '@ally-ui/focus-trap';
import {ScrollLockModel, type ScrollLockModelState} from '@ally-ui/scroll-lock';
import type {DialogRootModel, DialogRootModelState} from './DialogRootModel';
import type {DialogTitleModel as DialogTriggerModel} from './DialogTitleModel';

export interface DialogContentModelProps {
	forceMount?: boolean;
	allowPinchZoom?: boolean;
}

export interface DialogContentModelState {
	forceMount: boolean;
	allowPinchZoom: boolean;
}

export interface DialogContentModelEvents {
	/**
	 * Called when focus moves into the content after activation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	openAutoFocus?: (ev: Event) => void;
	/**
	 * Called when focus moves out of the content after deactivation. It can be
	 * prevented by calling `ev.preventDefault`.
	 */
	closeAutoFocus?: (ev: Event) => void;
	/**
	 * Called when the escape key is down. It can be prevented by calling
	 * `ev.preventDefault`.
	 */
	escapeKeyDown?: (ev: KeyboardEvent) => void;
	/**
	 * Called when an interaction (mouse or touch) occurs outside of the content.
	 * It can be prevented by calling `ev.preventDefault`.
	 */
	interactOutside?: (ev: MouseEvent | TouchEvent) => void;
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

export interface DialogContentModelDerived {
	show: boolean;
}

export class DialogContentModel extends NodeComponentModel<
	DialogContentModelProps,
	DialogContentModelState,
	DialogContentModelEvents,
	DialogContentModelAttributes
> {
	id = 'content';

	#focusTrap: FocusTrapModel;
	#scrollLock: ScrollLockModel;

	constructor(
		initialProps: DialogContentModelProps,
		initialEvents: DialogContentModelEvents,
		parent: DialogRootModel,
	) {
		super(initialProps, initialEvents, parent);
		this.#focusTrap = this.#createFocusTrap();
		this.#scrollLock = this.#createScrollLock();
	}

	initialState(initialProps: DialogContentModelProps): DialogContentModelState {
		return {
			forceMount: initialProps.forceMount ?? false,
			allowPinchZoom: initialProps.allowPinchZoom ?? false,
		};
	}

	derived(
		state: DialogContentModelState,
		rootState: DialogRootModelState,
	): DialogContentModelDerived {
		return {
			show: state.forceMount || rootState.open,
		};
	}

	attributes(rootState: DialogRootModelState): DialogContentModelAttributes {
		const root = this.root as DialogRootModel;
		const baseAttributes = {
			id: `${root.id}-${this.id}`,
			role: 'dialog',
			'aria-labelledby': `${root.id}-title`,
			'aria-describedby': `${root.id}-description`,
			'data-state': rootState.open ? 'open' : 'closed',
		};
		return mergeAttributes(
			baseAttributes,
			this.#focusTrap.attributes(this.#deriveFocusTrapModelState(rootState)),
			this.#scrollLock.attributes(),
		) as DialogContentModelAttributes;
	}

	#unsubscribeState?: () => void;
	#unsubscribeRootState?: () => void;
	mount(): void {
		super.mount();
		this.#unsubscribeState = this.state.subscribe(this.#onStateChange);
		this.#unsubscribeRootState = this.root.state.subscribe(
			this.#onRootStateChange,
		);
	}

	unmount(): void {
		super.unmount();
		this.#unsubscribeState?.();
		this.#unsubscribeRootState?.();
	}

	#onStateChange = (state: DialogContentModelState) => {
		this.#focusTrap.state.setValue(
			this.#deriveFocusTrapModelState(this.root.state.value),
		);
		this.#scrollLock.state.setValue(
			this.#deriveScrollLockModelState(state, this.root.state.value),
		);
	};

	#onRootStateChange = (
		rootState: DialogRootModelState,
		prev?: DialogRootModelState,
	) => {
		this.#focusTrap.state.setValue(this.#deriveFocusTrapModelState(rootState));
		this.#scrollLock.state.setValue(
			this.#deriveScrollLockModelState(this.state.value, rootState),
		);
		if (rootState.open !== prev?.open) {
			if (rootState.open) {
				this.open();
			} else {
				this.close();
			}
		}
	};

	bind(node: HTMLElement): void {
		super.bind(node);
		this.#focusTrap.bind(node);
		this.#scrollLock.bind(node);
		this.#checkTitle();
		const root = this.root as DialogRootModel;
		if (root.state.value.open) {
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

	unregister(): void {
		super.unregister();
		this.close();
	}

	open() {
		this.#focusTrap.activate();
		this.#scrollLock.activate();
	}

	close() {
		this.#focusTrap.deactivate();
		this.#scrollLock.deactivate();
	}

	#createFocusTrap() {
		const contentTrap = new FocusTrapModel(
			{
				initialActive: true,
			},
			{
				activateAutoFocus: this.events?.openAutoFocus,
				deactivateAutoFocus: this.#onDeactivateFocusToTrigger,
				escapeKeyDown: this.events?.escapeKeyDown,
				interactOutside: this.events?.interactOutside,
			},
		);
		const root = this.root as DialogRootModel;
		contentTrap.state.requestUpdate = (trapUpdater) => {
			root.state.requestUpdate?.((prev) => {
				const trapState =
					trapUpdater instanceof Function
						? trapUpdater(contentTrap.state.value)
						: trapUpdater;
				return {
					...prev,
					open: trapState.active,
				};
			});
		};
		return contentTrap;
	}

	#deriveFocusTrapModelState(
		rootState: DialogRootModelState,
	): FocusTrapModelState {
		return {
			active: rootState.open,
			modal: rootState.modal,
		};
	}

	#onDeactivateFocusToTrigger = (ev: Event) => {
		this.events?.closeAutoFocus?.(ev);
		if (ev.defaultPrevented) {
			return;
		}
		ev.preventDefault();
		const trigger = this.root.findChild(this.#isTriggerWithNode);
		trigger?.node?.focus();
	};

	#isTriggerWithNode = (c: ComponentModel): c is DialogTriggerModel =>
		c.id === 'trigger' && (c as DialogTriggerModel).node != null;

	#createScrollLock() {
		const scrollLock = new ScrollLockModel({
			initialActive: true,
		});
		const root = this.root as DialogRootModel;
		scrollLock.state.requestUpdate = (lockUpdater) => {
			root.state.requestUpdate?.((prev) => {
				const lockState =
					lockUpdater instanceof Function
						? lockUpdater(scrollLock.state.value)
						: lockUpdater;
				return {
					...prev,
					open: lockState.active,
				};
			});
		};
		return scrollLock;
	}

	#deriveScrollLockModelState(
		state: DialogContentModelState,
		rootState: DialogRootModelState,
	): ScrollLockModelState {
		return {
			active: rootState.open,
			allowPinchZoom: state.allowPinchZoom,
		};
	}
}
