import type {$ComponentTypeOf, RootModel} from './root';
import {StateModel} from './state';

export abstract class ComponentModel<
	TRootModel extends RootModel = any,
	TOptions = any,
	TState = any,
> extends StateModel<TOptions, TState> {
	rootModel: TRootModel;
	options: TOptions;
	type: string;
	mounted = false;
	node?: HTMLElement;

	constructor(rootModel: TRootModel, initialOptions: TOptions) {
		super(initialOptions);
		this.rootModel = rootModel;
		this.options = initialOptions;
		this.type = this.getType();
	}

	getId(): string {
		return `${this.rootModel.id}-${this.getType()}`;
	}

	getAttributes(): unknown {
		return {};
	}

	abstract getType(): $ComponentTypeOf<TRootModel>;
}