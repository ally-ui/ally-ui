import type {ComponentModel} from './ComponentModel';
import {StateModel} from './StateModel';
import {findLastInMap} from './utils/map';

export interface RootOptions {}

export abstract class RootModel<
	TComponentType extends string = any,
	TOptions extends RootOptions = any,
	TState = any,
> extends StateModel<TState> {
	id: string;
	options: TOptions;

	constructor(id: string, initialOptions: TOptions, initialState: TState) {
		super(initialState);
		this.id = id;
		this.options = initialOptions;
	}

	#components = new Map<string, ComponentModel>();

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
		return component;
	}

	watchRegister?(component: ComponentModel): void;

	deregisterComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.getStateOptions().debug) {
				console.error(`deregisterComponent(${componentId}), not found`);
			}
			return;
		}
		this.#components.delete(componentId);
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
			if (this.getStateOptions().debug) {
				console.error(`mountComponent(${componentId}), not initialized`);
			}
			return;
		}
		component.mounted = true;
		this.watchMount?.(component);
	}

	watchMount?(component: ComponentModel): void;

	unmountComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.getStateOptions().debug) {
				console.error(`unmountComponent(${componentId}), not found`);
			}
			return;
		}
		component.mounted = false;
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
			if (this.getStateOptions().debug) {
				console.error(
					`bindComponent(${componentId}, ${node}), not initialized`,
				);
			}
			return;
		}
		component.node = node;
		this.watchBind?.(component);
	}

	watchBind?(component: ComponentModel): void;

	unbindComponent(componentId: string) {
		const component = this.#components.get(componentId);
		if (component === undefined) {
			if (this.getStateOptions().debug) {
				console.error(`unbindNode(${componentId}), not initialized`);
			}
			return;
		}
		delete component.node;
		this.watchUnbind?.(component);
	}

	watchUnbind?(component: ComponentModel): void;

	domId() {
		return `ally-${this.id}`;
	}

	componentDomId(type: TComponentType) {
		return `${this.domId()}-${type}`;
	}

	findComponent(
		predicate: (
			component: ComponentModel<RootModel<TComponentType, TOptions, TState>>,
		) => boolean,
	): ComponentModel<RootModel<TComponentType, TOptions, TState>> | undefined {
		return findLastInMap(this.#components, predicate);
	}
}

export type $ComponentTypeOf<TRootModel> = TRootModel extends RootModel<
	infer TComponentType
>
	? TComponentType
	: never;

export type $OptionsOf<TRootModel> = TRootModel extends RootModel<
	any,
	infer TOptions
>
	? TOptions
	: never;

export type $StateOf<TRootModel> = TRootModel extends RootModel<
	any,
	any,
	infer TState
>
	? TState
	: never;
