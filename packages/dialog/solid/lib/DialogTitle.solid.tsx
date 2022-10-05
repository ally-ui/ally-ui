import {
	DialogTitleModel,
	type DialogTitleModelAttributes,
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
	if (rootModel == null) {
		throw new Error('<Dialog.Title/> must be a child of `<Dialog.Root/>`');
	}
	const component = new DialogTitleModel({}, undefined, rootModel);

	onMount(() => {
		component.mount();
	});
	onCleanup(() => {
		component.unmount();
		component.unregister();
	});

	const bindRef = createBindRef((node) => {
		if (node == null) {
			component.unbind();
		} else {
			component.bind(node);
		}
	});
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
