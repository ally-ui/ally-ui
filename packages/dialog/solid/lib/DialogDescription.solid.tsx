import {
	DialogDescriptionModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {
	combinedRef,
	Slot,
	SlottableProps,
	useNodeComponentModel,
} from '@ally-ui/solid';
import type {JSX} from 'solid-js';
import {useDialogRootModel} from './context';

export type DialogDescriptionProps = SlottableProps<
	DialogCloseModelAttributes,
	JSX.HTMLAttributes<HTMLParagraphElement>
>;

export default function DialogDescription(props: DialogDescriptionProps) {
	const rootModel = useDialogRootModel();
	if (rootModel == null) {
		throw new Error(
			'<Dialog.Description/> must be a child of `<Dialog.Root/>`',
		);
	}
	const component = new DialogDescriptionModel({}, undefined, rootModel);

	const [bindRef] = useNodeComponentModel(component);
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Slot ref={ref} props={props} attributes={component.attributes()}>
			{(renderProps) => (
				<p ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</p>
			)}
		</Slot>
	);
}
