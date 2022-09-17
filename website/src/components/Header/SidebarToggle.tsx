/** @jsxImportSource preact */
import type {FunctionalComponent} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';

const FOCUSABLE_SELECTOR =
	'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

const SidebarToggle: FunctionalComponent = () => {
	const [showSidebar, setShowSidebar] = useState(false);

	useEffect(
		function syncSidebar() {
			const body = document.querySelector('body')!;
			if (showSidebar) {
				body.classList.add('sidebar');
			} else {
				body.classList.remove('sidebar');
			}
		},
		[showSidebar],
	);

	useEffect(
		function closeSidebarOnClickOutside() {
			if (!showSidebar) {
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
				setShowSidebar(false);
			};
			window.addEventListener('click', handleClick);
			return () => {
				window.removeEventListener('click', handleClick);
			};
		},
		[showSidebar],
	);

	useEffect(
		function closeSidebarOnEscape() {
			if (!showSidebar) {
				return;
			}
			const sidebar = document.querySelector('#sidebar');
			if (sidebar === null) {
				return;
			}
			const handleKeyDown = (ev: KeyboardEvent) => {
				if (ev.key === 'Escape') {
					setShowSidebar(false);
				}
			};
			window.addEventListener('keydown', handleKeyDown);
			return () => {
				window.removeEventListener('keydown', handleKeyDown);
			};
		},
		[showSidebar],
	);

	useEffect(
		function focusSidebarOnOpen() {
			if (!showSidebar) {
				return;
			}
			const sidebar = document.querySelector('#sidebar');
			const target = sidebar?.querySelector(FOCUSABLE_SELECTOR);
			if (target === null) {
				return;
			}
			if (!(target instanceof HTMLElement)) {
				return;
			}
			target.focus();
		},
		[showSidebar],
	);

	const toggleRef = useRef<HTMLButtonElement>(null);
	useEffect(
		function focusToggleOnClose() {
			if (showSidebar) {
				return;
			}
			toggleRef.current?.focus();
		},
		[showSidebar],
	);

	return (
		<button
			ref={toggleRef}
			type="button"
			aria-pressed={showSidebar ? 'true' : 'false'}
			id="sidebar-toggle"
			onClick={() => setShowSidebar(!showSidebar)}
			className="wh-8"
		>
			{showSidebar ? (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon icon-tabler icon-tabler-x"
					width="100%"
					height="100%"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="18" y1="6" x2="6" y2="18" />
					<line x1="6" y1="6" x2="18" y2="18" />
				</svg>
			) : (
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon icon-tabler icon-tabler-menu"
					width="100%"
					height="100%"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path stroke="none" d="M0 0h24v24H0z" fill="none" />
					<line x1="4" y1="8" x2="20" y2="8" />
					<line x1="4" y1="16" x2="20" y2="16" />
				</svg>
			)}
			<span className="sr-only">Toggle sidebar</span>
		</button>
	);
};

export default SidebarToggle;
