/** @jsxImportSource preact */
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
			<h2 className="mb-2 text-lg font-bold">On this page</h2>
			<ul>
				<li>
					<a
						href="#overview"
						className={cx(
							'block px-4 py-2 font-medium border-l-2 hover:text-accent focus:text-accent border-shade-200 ring-inset',
							{
								'text-accent border-accent': activeId === 'overview',
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
								className="block px-4 py-2 font-medium border-l-2 hover:text-accent focus:text-accent border-shade-200 ring-inset"
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
