import {StateModel} from './StateModel';

export abstract class ComponentModel<
	TState extends object = any,
	TDerived extends object = TState,
> extends StateModel<TState> {
	parent?: ComponentModel;
	root: ComponentModel;

	constructor(initialState: TState = {} as TState, parent?: ComponentModel) {
		super(initialState);
		this.parent = parent;
		this.root = this.parent?.root ?? this;
		this.parent?.addChild(this);
	}

	abstract readonly id: string;

	#children: ComponentModel[] = [];
	addChild<TChildModel extends ComponentModel>(
		child: TChildModel,
	): TChildModel {
		if (this.#children.find((c) => c === child) == null) {
			this.#children.push(child);
		}
		return child;
	}

	findChild<TChildModel extends ComponentModel>(
		predicate: (c: ComponentModel) => c is TChildModel,
	): TChildModel | undefined {
		return this.#children.find(predicate);
	}

	removeChild<TChildModel extends ComponentModel>(
		child: TChildModel,
	): TChildModel {
		const idx = this.#children.findIndex((c) => c === child);
		if (idx !== -1) {
			this.#children.splice(idx, 1);
		}
		return child;
	}

	derived?(..._dependencies: unknown[]): TDerived;

	onRegister(): void {
		this.parent?.addChild(this);
	}
	onDeregister(): void {
		this.parent?.removeChild(this);
	}

	mounted = false;
	onMount(): void {
		this.mounted = true;
	}
	onUnmount(): void {
		this.mounted = false;
	}
}
