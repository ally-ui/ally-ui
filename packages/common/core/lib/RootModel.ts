import type {ComponentModel} from './ComponentModel';
import {StateModel} from './StateModel';
import {findLastInMap} from './utils/map';

export abstract class RootModel<
	TComponentType extends string = any,
	TState extends object = any,
> extends StateModel<TState> {
	id: string;

	constructor(id: string, initialState: TState) {
		super(initialState);
		this.id = id;
	}

	#components = new Map<string, ComponentModel>();

	watchStateChange(newState: TState, prev: TState) {
		this.#components.forEach((c) => {
			c.watchRootStateChange?.(newState, prev);
		});
	}

	/**
	 * Initialize a component of the model. This should run before the component
	 * is mounted and before a reference to the DOM is obtained.
	 * @param component The component to register.
	 * @returns The registered component.
	 */
	registerComponent<TComponentModel extends ComponentModel>(
		component: TComponentModel,
	): TComponentModel {
		this.#components.set(component.getId(), component);
		this.watchRegister?.(component);
		component.watchRegister?.();
		return component;
	}

	watchRegister?(component: ComponentModel): void;

	deregisterComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`deregisterComponent(${componentId}), not found`);
			}
			return;
		}
		this.#components.delete(componentId);
		component.watchDeregister?.();
		this.watchDeregister?.(component);
	}

	watchDeregister?(component: ComponentModel): void;

	/**
	 * Mark a component as mounted. This signals when a component has completed
	 * its initialization phase and is ready to receive events.
	 * @param componentId The ID of the component to mount.
	 */
	mountComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`mountComponent(${componentId}), not initialized`);
			}
			return;
		}
		component.mounted = true;
		this.watchMount?.(component);
		component.watchMount?.();
	}

	watchMount?(component: ComponentModel): void;

	unmountComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`unmountComponent(${componentId}), not found`);
			}
			return;
		}
		component.mounted = false;
		component.watchUnmount?.();
		this.watchUnmount?.(component);
	}

	watchUnmount?(component: ComponentModel): void;

	/**
	 * Save a reference to the DOM node that the component abstracts over.
	 * @param componentId The ID of the component that holds the node reference.
	 * @param node The DOM node reference.
	 */
	bindComponent(componentId: string, node: HTMLElement) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(
					`bindComponent(${componentId}, ${node}), not initialized`,
				);
			}
			return;
		}
		component.node = node;
		this.watchBind?.(component);
		component.watchBind?.();
	}

	watchBind?(component: ComponentModel): void;

	unbindComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.debug) {
				console.error(`unbindNode(${componentId}), not initialized`);
			}
			return;
		}
		delete component.node;
		component.watchUnbind?.();
		this.watchUnbind?.(component);
	}

	watchUnbind?(component: ComponentModel): void;

	domId() {
		return `ally-${this.id}`;
	}

	componentDomId(type: TComponentType) {
		return `${this.domId()}-${type}`;
	}

	findComponent<TComponentModel extends ComponentModel>(
		predicate: (component: TComponentModel) => boolean,
	): TComponentModel | undefined {
		return findLastInMap(
			this.#components as Map<string, TComponentModel>,
			predicate,
		);
	}
}

export type $ComponentTypeOf<TRootModel> = TRootModel extends RootModel<
	infer TComponentType
>
	? TComponentType
	: never;

export type $StateOf<TRootModel> = TRootModel extends RootModel<
	any,
	infer TState
>
	? TState
	: never;
