import {
	DialogRootModel,
	type DialogRootModelProps,
	type DialogRootModelEvents,
} from '@ally-ui/core-dialog';
import {
	useRunOnce,
	useSyncedOption,
	useComponentModel,
	type ReactEventHandlers,
} from '@ally-ui/react';
import React from 'react';
import {DialogRootModelContext, DialogRootStateContext} from './context';

export type DialogRootProps = React.PropsWithChildren &
	DialogRootModelProps &
	ReactEventHandlers<DialogRootModelEvents>;

export default function DialogRoot({
	children,
	open,
	onOpenChange,
	initialOpen,
	modal,
}: DialogRootProps) {
	const id = React.useId();
	const rootModel = useRunOnce(
		() =>
			new DialogRootModel(
				id,
				{
					initialOpen,
					modal,
				},
				{
					openChange: onOpenChange,
				},
			),
	);
	const [rootState, setRootState] = useComponentModel(rootModel);
	// TODO #44 Reduce syncing boilerplate.
	useSyncedOption({
		option: open,
		onOptionChange: (open) =>
			setRootState((prevState) => ({...prevState, open})),
		internal: rootState.open,
		onInternalChange: onOpenChange,
	});
	useSyncedOption({
		option: modal,
		onOptionChange: (modal) => {
			setRootState((prevState) => ({...prevState, modal}));
		},
	});

	return (
		<DialogRootModelContext.Provider value={rootModel}>
			<DialogRootStateContext.Provider value={rootState}>
				{children}
			</DialogRootStateContext.Provider>
		</DialogRootModelContext.Provider>
	);
}
