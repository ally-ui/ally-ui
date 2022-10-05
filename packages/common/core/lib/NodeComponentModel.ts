import {ComponentModel} from './ComponentModel';

export interface NodeBindable<TAttributes extends object = any> {
	/**
	 * The attributes for this node.
	 * @param _dependencies The state dependencies for computing the attributes.
	 * @returns The node attributes for the component.
	 */
	attributes(..._dependencies: unknown[]): TAttributes;

	node?: HTMLElement;
	onBind?(node: HTMLElement): void;
	onUnbind?(): void;
}

export abstract class NodeComponentModel<
		TState extends object = any,
		TDerived extends object = TState,
		TAttributes extends object = any,
	>
	extends ComponentModel<TState, TDerived>
	implements NodeBindable<TAttributes>
{
	attributes(..._dependencies: unknown[]): TAttributes {
		return {} as TAttributes;
	}

	node?: HTMLElement;
	onBind(node: HTMLElement): void {
		this.node = node;
	}
	onUnbind(): void {
		this.node = undefined;
	}
}
