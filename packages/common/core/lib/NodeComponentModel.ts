import {ComponentModel} from './ComponentModel';
import {Observable} from './Observable';

export interface NodeBindable<TAttributes extends object = any> {
	/**
	 * The attributes for this node.
	 * @param _dependencies The state dependencies for computing the attributes.
	 * @returns The node attributes for the component.
	 */
	attributes(..._dependencies: unknown[]): TAttributes;

	node?: HTMLElement;
	bind(node: HTMLElement): void;
	unbind(): void;
}

export abstract class NodeComponentModel<
		TProps extends object = any,
		TEvents extends object = any,
		TAttributes extends object = any,
	>
	extends ComponentModel<TProps, TEvents>
	implements NodeBindable<TAttributes>
{
	attributes(..._dependencies: unknown[]): TAttributes {
		return {} as TAttributes;
	}

	node?: HTMLElement;
	onBind = new Observable<HTMLElement>();
	bind(node: HTMLElement): void {
		const prevNode = this.node;
		this.node = node;
		this.onBind.notify(node, prevNode);
	}
	onUnbind = new Observable<HTMLElement | undefined>();
	unbind(): void {
		const prevNode = this.node;
		this.node = undefined;
		this.onUnbind.notify(undefined, prevNode);
	}
}
