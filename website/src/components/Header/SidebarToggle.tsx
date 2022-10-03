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
			if (!showSidebar) return;
			const sidebar = document.querySelector('#sidebar');
			if (sidebar == null) return;
			const handleClick = (ev: Event) => {
				if (!(ev.target instanceof Element)) return;
				if (sidebar.contains(ev.target)) return;
				setShowSidebar(false);
				ev.preventDefault();
				ev.stopPropagation();
			};
			window.addEventListener('click', handleClick, {capture: true});
			return () => {
				window.removeEventListener('click', handleClick, {capture: true});
			};
		},
		[showSidebar],
	);

	useEffect(
		function closeSidebarOnEscape() {
			if (!showSidebar) return;
			const sidebar = document.querySelector('#sidebar');
			if (sidebar == null) return;
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

	useEffect(function closeSidebarOnScreenWide() {
		const query = window.matchMedia('screen and (min-width: 50rem)');
		const handleMediaChange = (ev: MediaQueryListEvent) => {
			if (ev.matches) {
				setShowSidebar(false);
			}
		};
		query.addEventListener('change', handleMediaChange);
		return () => {
			query.removeEventListener('change', handleMediaChange);
		};
	});

	useEffect(
		function focusSidebarOnOpen() {
			if (!showSidebar) return;
			const sidebar = document.querySelector('#sidebar');
			const target = sidebar?.querySelector(FOCUSABLE_SELECTOR);
			if (target == null) return;
			if (!(target instanceof HTMLElement)) return;
			target.focus();
		},
		[showSidebar],
	);

	const toggleRef = useRef<HTMLInputElement>(null);
	useEffect(
		function focusToggleOnClose() {
			if (showSidebar) return;
			toggleRef.current?.focus();
		},
		[showSidebar],
	);

	return (
		<div class="flex-center flex">
			<input
				id="sidebar-toggle"
				type="checkbox"
				ref={toggleRef}
				checked={showSidebar}
				onClick={() => setShowSidebar(!showSidebar)}
				aria-label="Show sidebar"
				class="wh-6 before:bg-word after:bg-word relative m-0 cursor-pointer appearance-none bg-transparent before:absolute before:top-1.5 before:h-0.5 before:w-full before:rounded-sm before:transition-transform after:absolute after:bottom-1.5 after:h-0.5 after:w-full after:rounded-sm after:transition-transform checked:before:translate-y-[0.32rem] checked:before:rotate-45 checked:after:translate-y-[-0.32rem] checked:after:-rotate-45"
			/>
		</div>
	);
};

export default SidebarToggle;
