import type {$ComponentTypeOf, $StateOf, RootModel} from './root';
import {StateModel} from './state';

export abstract class ComponentModel<
	TRootModel extends RootModel = any,
	TOptions = any,
	TState = any,
> extends StateModel<TOptions, TState> {
	rootModel: TRootModel;
	options: TOptions;
	type: $ComponentTypeOf<TRootModel>;
	mounted = false;
	node?: HTMLElement;

	constructor(rootModel: TRootModel, initialOptions: TOptions) {
		super(initialOptions);
		this.rootModel = rootModel;
		this.options = initialOptions;
		this.type = this.getType();
	}

	getId(): string {
		return `${this.rootModel.rootId()}-${this.getType()}`;
	}

	getAttributes(_rootState?: $StateOf<TRootModel>) {
		return {};
	}

	abstract getType(): $ComponentTypeOf<TRootModel>;
}
