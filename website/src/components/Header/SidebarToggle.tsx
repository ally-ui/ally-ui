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

export default SidebarToggle;
