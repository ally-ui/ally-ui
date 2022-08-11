import {trapFocus, type FocusTrap} from '@ally-ui/focus-trap';
import {Observable, observable} from '@ally-ui/observable';

interface UILibraryOptions {
	waitForDOM?: () => Promise<void>;
}

type TSubcomponentType =
	| 'trigger'
	| 'content'
	| 'title'
	| 'description'
	| 'close';

interface TSubcomponent {
	id: string;
	type: string;
	mounted: boolean;
	ref?: HTMLElement;
}

export interface DialogModelOptions {
	defaultOpen?: boolean;
}

export interface DialogModelState {
	open: boolean;
}

export class DialogModel {
	#state: DialogModelState;
	state: Observable<DialogModelState>;
	#subcomponents: TSubcomponent[];

	#id = 0;
	#generateId() {
		return String(this.#id++);
	}

	constructor({defaultOpen = false}: DialogModelOptions = {}) {
		this.#state = {
			open: defaultOpen,
		};
		this.state = observable(this.#state);
		this.#subcomponents = [];

		this.#unsubscribeState = this.state.subscribe((newState) =>
			this.#watchState(newState),
		);
	}

	#uiLibraryOptions?: UILibraryOptions;
	configureUILibrary(options: UILibraryOptions) {
		this.#uiLibraryOptions = options;
	}

	#unsubscribeState?: () => void;
	cleanup() {
		this.#unsubscribeState?.();
	}

	init(type: TSubcomponentType): string {
		const id = this.#generateId();
		this.#subcomponents.push({id, type, mounted: false});
		return id;
	}

	deinit(type: TSubcomponentType, id: string) {
		const idx = this.#subcomponents.findIndex(
			(s) => s.type === type && s.id === id,
		);
		this.#subcomponents.splice(idx, 1);
	}

	mount(id: string, ref?: HTMLElement) {
		const subcomponent = this.#subcomponents.find((s) => s.id === id);
		if (subcomponent === undefined) {
			throw new Error(
				`Cannot mount subcomponent with ID ${id} as it is not initialized`,
			);
		}
		subcomponent.mounted = true;
		subcomponent.ref = ref;
	}

	unmount(id: string) {
		const subcomponent = this.#subcomponents.find((s) => s.id === id);
		if (subcomponent === undefined) {
			throw new Error(
				`Cannot unmount subcomponent with ID ${id} as it is not initialized`,
			);
		}
		subcomponent.mounted = false;
		delete subcomponent.ref;
	}

	#watchState = (newState: DialogModelState) => {
		if (this.#state.open !== newState.open) {
			this.#openEffect(newState.open);
		}
		this.#state = newState;
	};

	async #openEffect(open: boolean) {
		if (open) {
			await this.#openDialog();
		} else {
			this.#closeDialog();
		}
	}

	#contentTrap?: FocusTrap;
	async #openDialog() {
		const content = this.#subcomponents.find(
			(s) => s.type === 'content' && s.mounted,
		);
		if (content === undefined) {
			throw new Error(
				`Cannot open dialog as content subcomponent is not initialized`,
			);
		}
		if (!content.mounted) {
			throw new Error(
				`Cannot open dialog as content subcomponent is not mounted`,
			);
		}
		await this.#uiLibraryOptions?.waitForDOM?.();
		if (content.ref === undefined) {
			throw new Error(
				`Cannot open dialog as content subcomponent ref is missing`,
			);
		}
		this.#contentTrap = trapFocus(content.ref);
	}

	#closeDialog() {
		if (this.#contentTrap === undefined) {
			return;
		}
		this.#contentTrap.deactivate();
	}
}
