/** @jsxImportSource react */
import '@docsearch/css';
import {useCallback, useRef, useState} from 'react';
import {ALGOLIA} from '../../config';
import './Search.css';

import * as docSearchReact from '@docsearch/react';
import {createPortal} from 'react-dom';

const DocSearchModal =
	docSearchReact.DocSearchModal ??
	(docSearchReact as any).default.DocSearchModal;
const useDocSearchKeyboardEvents =
	docSearchReact.useDocSearchKeyboardEvents ??
	(docSearchReact as any).default.useDocSearchKeyboardEvents;

export default function Search() {
	const [isOpen, setIsOpen] = useState(false);
	const searchButtonRef = useRef<HTMLButtonElement>(null);
	const [initialQuery, setInitialQuery] = useState('');

	const onOpen = useCallback(() => {
		setIsOpen(true);
	}, [setIsOpen]);

	const onClose = useCallback(() => {
		setIsOpen(false);
	}, [setIsOpen]);

	const onInput = useCallback(
		(e) => {
			setIsOpen(true);
			setInitialQuery(e.key);
		},
		[setIsOpen, setInitialQuery],
	);

	useDocSearchKeyboardEvents({
		isOpen,
		onOpen,
		onClose,
		onInput,
		searchButtonRef,
	});

	return (
		<>
			<button
				type="button"
				ref={searchButtonRef}
				onClick={onOpen}
				className="bg-shade-100 hover:bg-shade-100/50 flex-center text-shade-text/50 relative flex h-10 w-full rounded-full"
			>
				<span>Search</span>

				<span className="flex-center -md:hidden absolute inset-0 left-auto right-2 flex aspect-square h-full">
					<kbd className="text-shade-text/25 flex-center wh-6 flex rounded-md border-2 border-current text-sm font-black">
						/
					</kbd>
					<span className="sr-only">Press / to search</span>
				</span>
			</button>

			{isOpen &&
				createPortal(
					<DocSearchModal
						initialQuery={initialQuery}
						initialScrollY={window.scrollY}
						onClose={onClose}
						indexName={ALGOLIA.indexName}
						appId={ALGOLIA.appId}
						apiKey={ALGOLIA.apiKey}
						transformItems={(items) => {
							return items.map((item) => {
								// We transform the absolute URL into a relative URL to
								// work better on localhost, preview URLS.
								const a = document.createElement('a');
								a.href = item.url;
								const hash = a.hash === '#overview' ? '' : a.hash;
								return {
									...item,
									url: `${a.pathname}${hash}`,
								};
							});
						}}
					/>,
					document.body,
				)}
		</>
	);
}
