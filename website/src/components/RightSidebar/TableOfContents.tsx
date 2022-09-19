/** @jsxImportSource preact */
import type {MarkdownHeading} from 'astro';
import cx from 'classnames';
import type {FunctionalComponent} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

const DEFAULT_ID = 'overview';
const SCROLL_PADDING = 128;

function getClosestId(headingOffsets: Record<string, number>) {
	const {scrollTop} = document.documentElement;
	const offsetEntries = Object.entries(headingOffsets).sort(
		(a, b) => a[1] - b[1],
	);
	for (let i = 0; i < offsetEntries.length; i++) {
		const offset = offsetEntries[i]?.[1] ?? 0;
		// 64px padding lets us check in advance before the intersection changes.
		if (scrollTop + SCROLL_PADDING <= offset) {
			return offsetEntries[i - 1]?.[0] ?? DEFAULT_ID;
		}
	}
	return offsetEntries.at(-1)?.[0] ?? DEFAULT_ID;
}

interface TableOfContentsProps {
	headings: MarkdownHeading[];
}

const TableOfContents: FunctionalComponent<TableOfContentsProps> = ({
	headings = [],
}) => {
	const [activeId, setActiveId] = useState<string>('overview');
	useEffect(function loadInitialHash() {
		let id = window.location.hash.replace('#', '');
		if (id === '') id = DEFAULT_ID;
		setActiveId(id);
	}, []);

	useEffect(function watchLocationChange() {
		const handleHashChange = () => {
			setActiveId(window.location.hash.replace('#', ''));
		};
		window.addEventListener('hashchange', handleHashChange);
		return () => window.removeEventListener('hashchange', handleHashChange);
	}, []);

	const headingOffsets = useRef<Record<string, number>>({});
	useEffect(
		function syncHeadingOffsets() {
			function updateOffsets() {
				headingOffsets.current = {};
				const overviewElement = document.getElementById(DEFAULT_ID);
				if (overviewElement === null) {
					console.error('#overview heading missing on page');
					return;
				}
				const baseOffsetTop = overviewElement.offsetTop;
				headings.forEach((heading) => {
					const headingElement = document.getElementById(heading.slug);
					if (headingElement === null) return;
					headingOffsets.current[heading.slug] =
						headingElement.offsetTop - baseOffsetTop;
				});
			}
			updateOffsets();
			window.addEventListener('resize', updateOffsets);
			return () => window.removeEventListener('resize', updateOffsets);
		},
		[headings],
	);

	useEffect(function annotateLastElementOfSections() {
		headings.forEach(({slug}) => {
			const headingElement = document.getElementById(slug);
			const previousElement = headingElement?.previousElementSibling;
			if (previousElement === null) return;
			if (!(previousElement instanceof HTMLElement)) return;
			previousElement.dataset.before = slug;
		});
	}, []);

	useEffect(
		function watchHeadingIntersections() {
			const updateActiveIndex = () => {
				const id = getClosestId(headingOffsets.current);
				setActiveId(id);
				window.history.replaceState(null, '', '#' + id);
			};

			const observer = new IntersectionObserver(updateActiveIndex, {
				// 64px for the navbar
				rootMargin: `-${64 + SCROLL_PADDING}px 0px 0px`,
			});

			const overviewElement = document.getElementById(DEFAULT_ID);
			if (overviewElement !== null) observer.observe(overviewElement);
			headings.forEach(({slug}) => {
				const headingElement = document.getElementById(slug);
				if (headingElement !== null) observer.observe(headingElement);
				const previousElement = headingElement?.previousElementSibling;
				if (previousElement != null) observer.observe(previousElement);
			});

			return () => {
				observer.disconnect();
			};
		},
		[headings],
	);

	return (
		<>
			<h2 className="mb-2 text-lg font-bold">On this page</h2>
			<ul>
				<li>
					<a
						href={`#${DEFAULT_ID}`}
						className={cx(
							'block px-4 py-2 font-medium border-l-2 hover:text-accent focus:text-accent border-shade-200 ring-inset',
							{
								'text-accent border-accent': activeId === DEFAULT_ID,
							},
						)}
					>
						Overview
					</a>
				</li>
				{headings
					.filter(({depth}) => depth > 1 && depth < 4)
					.map((heading) => (
						<li>
							<a
								href={`#${heading.slug}`}
								className={cx(
									'block px-4 py-2 font-medium border-l-2 hover:text-accent focus:text-accent border-shade-200 ring-inset',
									{
										'text-accent border-accent': activeId === heading.slug,
									},
								)}
							>
								{heading.text}
							</a>
						</li>
					))}
			</ul>
		</>
	);
};

export default TableOfContents;
