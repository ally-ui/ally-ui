/** @jsxImportSource preact */
import cx from 'classnames';
import type {FunctionalComponent} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const THEMES = ['light', 'dark'];

const ICONS = [
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="icon icon-tabler icon-tabler-sun"
		width="24"
		height="24"
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
		class="icon icon-tabler icon-tabler-moon"
		width="24"
		height="24"
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
		if (typeof localStorage != null && localStorage.getItem('theme')) {
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
		<div class="flex-center bg-shade-100 hover:bg-shade-100/50 text-shade-text ring-accent inline-flex h-10 rounded-full p-1 focus-within:ring-2">
			{THEMES.map((t, i) => {
				const icon = ICONS[i];
				const checked = t === theme;
				return (
					<label
						class={cx(
							'flex h-full items-center rounded-full px-3 py-1',
							checked
								? 'bg-shade dark:bg-shade-200 text-accent'
								: 'cursor-pointer',
						)}
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
							class="w-0 appearance-none focus:ring-0"
						/>
					</label>
				);
			})}
		</div>
	);
};

export default ThemeToggle;
