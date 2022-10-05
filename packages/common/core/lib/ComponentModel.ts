import {Observable} from './Observable';
import {Stateful} from './Stateful';

export abstract class ComponentModel<
	TProps extends object = any,
	TState extends object = any,
	TEvents extends object = any,
> {
	root: ComponentModel;
	parent?: ComponentModel;
	state: Stateful<TState>;
	events?: Stateful<TEvents>;

	constructor(
		initialProps: TProps,
		initialEvents?: TEvents,
		parent?: ComponentModel,
	) {
		this.state = new Stateful(this.initialState(initialProps));
		if (initialEvents != null) {
			this.events = new Stateful(initialEvents);
		}
		this.root = this;
		parent?.addChild(this);
	}

	abstract initialState(initialProps: TProps): TState;

	#children: ComponentModel[] = [];
	addChild<TChildModel extends ComponentModel>(
		child: TChildModel,
	): TChildModel {
		if (this.#children.find((c) => c === child) == null) {
			child.root = this.root;
			child.parent = this;
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
			child.root = child;
			child.parent = undefined;
		}
		return child;
	}

	onRegister = new Observable<undefined>();
	register(): void {
		this.parent?.addChild(this);
		this.onRegister.notify(undefined);
	}
	onUnregister = new Observable<undefined>();
	unregister(): void {
		this.parent?.removeChild(this);
		this.onUnregister.notify(undefined);
	}

	mounted = false;
	onMount = new Observable<undefined>();
	mount(): void {
		this.mounted = true;
		this.onMount.notify(undefined);
	}
	onUnmount = new Observable<undefined>();
	unmount(): void {
		this.mounted = false;
		this.onUnmount.notify(undefined);
	}
}
