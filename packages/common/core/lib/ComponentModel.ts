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
		this.parent?.addChild(this);
		this.root = this.parent?.root ?? this;
	}

	abstract readonly id: string;

	#children: ComponentModel[] = [];
	addChild(child: ComponentModel) {
		if (this.#children.find((c) => c === child) == null) {
			this.#children.push(child);
		}
	}

	findChild<TChildModel extends ComponentModel = ComponentModel>(
		predicate: (c: ComponentModel) => c is TChildModel,
	): TChildModel | undefined {
		return this.#children.find(predicate);
	}

	removeChild(child: ComponentModel) {
		const idx = this.#children.findIndex((c) => c === child);
		if (idx !== -1) {
			this.#children.splice(idx, 1);
		}
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
