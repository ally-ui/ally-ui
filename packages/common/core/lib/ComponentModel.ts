import type {$ComponentTypeOf, $StateOf, RootModel} from './RootModel';
import {StateModel} from './StateModel';

export abstract class ComponentModel<
	TRootModel extends RootModel = any,
	TOptions = any,
	TState = any,
	TAttributes = any,
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

	getId() {
		return this.getType();
	}

	domId(): string {
		return `${this.rootModel.domId()}-${this.getType()}`;
	}

	getAttributes(_rootState?: $StateOf<TRootModel>): TAttributes {
		return {} as TAttributes;
	}

	abstract getType(): $ComponentTypeOf<TRootModel>;
}
