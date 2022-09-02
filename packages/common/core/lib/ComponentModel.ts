import type {$ComponentTypeOf, $StateOf, RootModel} from './RootModel';
import {StateModel} from './StateModel';

export abstract class ComponentModel<
	TRootModel extends RootModel = any,
	TState extends object = any,
	TDerived extends object = any,
	TAttributes extends object = any,
> extends StateModel<TState> {
	rootModel: TRootModel;
	type: $ComponentTypeOf<TRootModel>;
	mounted = false;
	node?: HTMLElement;

	constructor(rootModel: TRootModel, initialState: TState = {} as TState) {
		super(initialState);
		this.rootModel = rootModel;
		this.type = this.getType();
	}

	abstract getType(): $ComponentTypeOf<TRootModel>;

	deriveState?(_rootState?: $StateOf<TRootModel>, _state?: TState): TDerived;

	getId() {
		return this.getType();
	}

	domId(): string {
		return `${this.rootModel.domId()}-${this.getType()}`;
	}

	getAttributes(
		_rootState?: $StateOf<TRootModel>,
		_state?: TState,
	): TAttributes {
		return {} as TAttributes;
	}
}
