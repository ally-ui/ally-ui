import cx from 'classnames';
import type {FunctionalComponent} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const THEMES = ['light', 'dark'];

const ICONS = [
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-sun"
		width="1.5rem"
		height="1.5rem"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<circle cx="12" cy="12" r="4" />
		<path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
	</svg>,
	<svg
		xmlns="http://www.w3.org/2000/svg"
		className="icon icon-tabler icon-tabler-moon"
		width="1.5rem"
		height="1.5rem"
		viewBox="0 0 24 24"
		stroke-width="2"
		stroke="currentColor"
		fill="none"
		stroke-linecap="round"
		stroke-linejoin="round"
	>
		<path stroke="none" d="M0 0h24v24H0z" fill="none" />
		<path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
	</svg>,
];

const ThemeToggle: FunctionalComponent = () => {
	const [theme, setTheme] = useState(() => {
		if (import.meta.env.SSR) {
			return undefined;
		}
		if (typeof localStorage !== undefined && localStorage.getItem('theme')) {
			return localStorage.getItem('theme') ?? undefined;
		}
		if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark';
		}
		return 'light';
	});

	useEffect(
		function syncDark() {
			const root = document.documentElement;
			if (theme === 'light') {
				root.classList.remove('dark');
			} else {
				root.classList.add('dark');
			}
		},
		[theme],
	);

	return (
		<div className="inline-flex h-10 p-1 rounded-full flex-center bg-shade-100 text-shade-text focus-within:ring-2 ring-accent">
			{THEMES.map((t, i) => {
				const icon = ICONS[i];
				const checked = t === theme;
				return (
					<label
						className={cx('px-3 py-1 h-full flex items-center rounded-full', {
							'bg-shade dark:bg-shade-200 text-accent': checked,
						})}
					>
						{icon}
						<input
							type="radio"
							name="theme-toggle"
							checked={checked}
							value={t}
							title={`Use ${t} theme`}
							aria-label={`Use ${t} theme`}
							onChange={() => {
								localStorage.setItem('theme', t);
								setTheme(t);
							}}
							className="appearance-none focus:ring-0"
						/>
					</label>
				);
			})}
		</div>
	);
};

export default ThemeToggle;
