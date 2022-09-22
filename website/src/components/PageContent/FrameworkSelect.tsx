/** @jsxImportSource preact */
import type {FunctionComponent} from 'preact';
import {useEffect} from 'preact/hooks';
import {KNOWN_FRAMEWORKS} from '../../config';
import react from '../../icons/react.svg';
import solid from '../../icons/solid.svg';
import svelte from '../../icons/svelte.svg';
import vue from '../../icons/vue.svg';

interface FrameworkSelectProps {
	framework: keyof typeof KNOWN_FRAMEWORKS;
}

const ICONS: Record<keyof typeof KNOWN_FRAMEWORKS, string> = {
	react,
	solid,
	svelte,
	vue,
};

const FrameworkSelect: FunctionComponent<FrameworkSelectProps> = ({
	framework,
}) => {
	useEffect(
		function updateLocalStorage() {
			window.localStorage.setItem('framework', framework);
		},
		[framework],
	);
	return (
		<div className="text-shade-text relative">
			<div className="flex-center pointer-events-none absolute top-0 bottom-0 left-1 flex aspect-square">
				<img src={ICONS[framework]} alt={`${framework} icon`} class="wh-6" />
			</div>
			<select
				class="bg-shade-100 hover:bg-shade-100/50 flex h-10 cursor-pointer appearance-none items-center rounded-full pl-11 pr-9"
				value={framework}
				onInput={(ev) => {
					const newFramework = ev.currentTarget.value;
					// Replace the last occurrence of the current framework in the path.
					const pathTokens = window.location.pathname.split('/').reverse();
					const tokenIdx = pathTokens.findIndex((path) => path === framework);
					pathTokens[tokenIdx] = newFramework;
					window.location.pathname = pathTokens.reverse().join('/');
				}}
			>
				{Object.entries(KNOWN_FRAMEWORKS).map(([code, framework]) => (
					<option value={code} key={code}>
						<span>{framework}</span>
					</option>
				))}
			</select>
			<div className="flex-center pointer-events-none absolute inset-0 left-auto flex aspect-square">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-chevron-down"
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
					<polyline points="6 9 12 15 18 9" />
				</svg>
			</div>
		</div>
	);
};

export default FrameworkSelect;
