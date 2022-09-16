/** @jsxImportSource preact */
import type {FunctionalComponent} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const MenuToggle: FunctionalComponent = () => {
	const [sidebarShown, setSidebarShown] = useState(false);

	useEffect(
		function syncSidebar() {
			const body = document.querySelector('body')!;
			if (sidebarShown) {
				body.classList.add('sidebar');
			} else {
				body.classList.remove('sidebar');
			}
		},
		[sidebarShown],
	);

	useEffect(
		function closeSidebarOnClickOutside() {
			if (!sidebarShown) {
				return;
			}
			const sidebar = document.querySelector('#sidebar');
			if (sidebar === null) {
				return;
			}
			const handleClick = (ev: Event) => {
				if (!(ev.target instanceof Element)) {
					return;
				}
				if (sidebar.contains(ev.target)) {
					return;
				}
				setSidebarShown(false);
			};
			window.addEventListener('click', handleClick);
			return () => {
				window.removeEventListener('click', handleClick);
			};
		},
		[sidebarShown],
	);

	useEffect(
		function closeSidebarOnEscape() {
			if (!sidebarShown) {
				return;
			}
			const sidebar = document.querySelector('#sidebar');
			if (sidebar === null) {
				return;
			}
			const handleKeyDown = (ev: KeyboardEvent) => {
				if (ev.key === 'Escape') {
					setSidebarShown(false);
				}
			};
			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		},
		[sidebarShown],
	);

	return (
		<button
			type="button"
			aria-pressed={sidebarShown ? 'true' : 'false'}
			id="sidebar-toggle"
			onClick={() => setSidebarShown(!sidebarShown)}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M4 6h16M4 12h16M4 18h16"
				/>
			</svg>
			<span className="sr-only">Toggle sidebar</span>
		</button>
	);
};

export default MenuToggle;
