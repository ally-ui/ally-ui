import {
	DialogTitleModel,
	type DialogTitleModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	Slot,
	SlottableProps,
	useNodeComponentModel,
} from '@ally-ui/solid';
import type {JSX} from 'solid-js';
import {useDialogRootModel} from './context';

export type DialogTitleProps = SlottableProps<
	DialogTitleModelAttributes,
	JSX.HTMLAttributes<HTMLHeadingElement>
>;

export default function DialogTitle(props: DialogTitleProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogTitleModel({}, undefined, rootModel);

	const [bindRef] = useNodeComponentModel(component);
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Slot ref={ref} props={props} attributes={component.attributes()}>
			{(renderProps) => (
				<h1 ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</h1>
			)}
		</Slot>
	);
}
