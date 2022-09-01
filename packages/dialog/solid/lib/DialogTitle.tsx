import {
	DialogTitleModel,
	DialogTitleModelAttributes,
} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef, Slot, SlottableProps} from '@ally-ui/solid';
import {JSX, onCleanup, onMount} from 'solid-js';
import {useDialogRootModel} from './context';

export type DialogTitleProps = SlottableProps<
	DialogTitleModelAttributes,
	JSX.HTMLAttributes<HTMLHeadingElement>
>;

export default function DialogTitle(props: DialogTitleProps) {
	const rootModel = useDialogRootModel();
	if (rootModel === undefined) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = rootModel.registerComponent(
		new DialogTitleModel(rootModel, {}),
	);
	const id = component.getId();

	onMount(() => {
		rootModel.mountComponent(id);
	});
	onCleanup(() => {
		rootModel.unmountComponent(id);
	});

	const bindRef = createBindRef((node) => {
		if (node === null) {
			rootModel.unbindComponent(id);
		} else {
			rootModel.bindComponent(id, node);
		}
	});
	const ref = combinedRef(bindRef, props.ref);

	return (
		<Slot ref={ref} props={props} attributes={component.getAttributes()}>
			{(renderProps) => (
				<h1 ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</h1>
			)}
		</Slot>
	);
}
