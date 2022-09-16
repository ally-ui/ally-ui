import type {MarkdownHeading} from 'astro';
import cx from 'classnames';
import type {FunctionalComponent} from 'preact';
import {useState} from 'preact/hooks';

const TableOfContents: FunctionalComponent<{headings: MarkdownHeading[]}> = ({
	headings = [],
}) => {
	const [activeId] = useState<string>('overview');
	return (
		<>
			<h2 className="mb-2 text-xl font-bold">On this page</h2>
			<ul>
				<li
					className={cx(
						'hover:text-accent focus:text-accent border-l-2 border-shade-200 py-1 px-2',
						{
							'text-accent border-accent': activeId === 'overview',
						},
					)}
				>
					<a href="#overview">Overview</a>
				</li>
				{headings
					.filter(({depth}) => depth > 1 && depth < 4)
					.map((heading) => (
						<li
							className={cx(
								'hover:text-accent focus:text-accent border-l-2 border-shade-200 py-1 px-2',
							)}
						>
							<a href={`#${heading.slug}`}>{heading.text}</a>
						</li>
					))}
			</ul>
		</>
	);
};

export default TableOfContents;
