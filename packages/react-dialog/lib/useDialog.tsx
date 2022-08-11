import {DialogModel} from '@ally-ui/core-dialog';
import {useLayoutPromise, useObservable} from '@ally-ui/react-utils';
import {useEffect, useState} from 'react';

export interface UseDialogOptions {
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	open?: boolean;
}

export default function useDialog({
	defaultOpen,
	onOpenChange,
	open,
}: UseDialogOptions = {}) {
	const [model] = useState(() => new DialogModel({defaultOpen}));

	useEffect(
		function syncOpen() {
			if (open !== undefined) {
				model.state.update((s) => ({...s, open}));
			}
		},
		[open],
	);

	const state = useObservable(model.state, (newState, oldState) => {
		if (newState.open !== oldState.open) {
			onOpenChange?.(newState.open);
		}
	});

	const waitForDOM = useLayoutPromise([state]);

	useEffect(
		function setupUILibraryOptions() {
			model.configureUILibrary({
				waitForDOM,
			});
		},
		[model],
	);
	useEffect(
		function cleanupModel() {
			return () => {
				model.cleanup();
			};
		},
		[model],
	);

	return [model, state] as const;
}
