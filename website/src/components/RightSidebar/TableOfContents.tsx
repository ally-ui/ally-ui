/** @jsxImportSource preact */
import type {MarkdownHeading} from 'astro';
import cx from 'classnames';
import type {FunctionalComponent} from 'preact';
import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type MutableRef,
} from 'preact/hooks';

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

type TemporaryTrue = MutableRef<boolean> & {setTrue: () => void};

function useTemporaryTrue(ms: number): TemporaryTrue {
	const value = useRef(false);
	const valueTimeout = useRef<number | undefined>();
	const setTrue = useCallback(() => {
		value.current = true;
		window.clearTimeout(valueTimeout.current);
		window.setTimeout(() => {
			value.current = false;
		}, ms);
	}, [ms]);
	Object.assign(value, {setTrue});
	return value as TemporaryTrue;
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

	/**
	 * Check if the scroll is caused by navigating the table of contents.
	 */
	const scrollSourceIsHashChange = useTemporaryTrue(100);
	useEffect(function watchLocationChange() {
		const handleHashChange = () => {
			setActiveId(window.location.hash.replace('#', ''));
			scrollSourceIsHashChange.setTrue();
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
				if (scrollSourceIsHashChange.current) {
					return;
				}
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
			<h2 className="mb-2 text-lg font-semibold">On this page</h2>
			<ul class="text-sm">
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
					.map(({slug, depth, text}) => (
						<li>
							<a
								href={`#${slug}`}
								className={cx(
									'block px-4 py-2 border-l-2 hover:text-accent focus:text-accent border-shade-200 ring-inset',
									activeId === slug && 'text-accent border-accent',
									depth === 2 && 'pl-4 font-medium',
									depth === 3 && 'pl-8',
									depth === 4 && 'pl-12',
								)}
							>
								{text}
							</a>
						</li>
					))}
			</ul>
		</>
	);
};

export default TableOfContents;
