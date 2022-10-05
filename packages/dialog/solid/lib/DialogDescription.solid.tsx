import {
	DialogDescriptionModel,
	type DialogCloseModelAttributes,
} from '@ally-ui/core-dialog';
import {combinedRef, createBindRef, Slot, SlottableProps} from '@ally-ui/solid';
import {JSX, onCleanup, onMount} from 'solid-js';
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
				<p ref={renderProps.ref} {...renderProps.attributes()}>
					{renderProps.children}
				</p>
			)}
		</Slot>
	);
}
