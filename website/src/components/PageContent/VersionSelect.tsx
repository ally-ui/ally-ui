/** @jsxImportSource preact */
import type {FunctionComponent} from 'preact';
import {useMemo} from 'preact/hooks';
import {compareVersionStr} from '../../utils/version';

interface VersionSelectProps {
	currentVersion?: string | undefined;
	versions: string[];
}

const LanguageSelect: FunctionComponent<VersionSelectProps> = ({
	currentVersion,
	versions,
}) => {
	const latestVersion = useMemo(
		() => versions.sort(compareVersionStr).at(-1)!,
		[versions],
	);
	return (
		<div class="relative w-fit">
			<select
				value={currentVersion ?? latestVersion}
				onInput={(ev) => {
					const newVersion = ev.currentTarget.value;
					const pathTokens = window.location.pathname
						.split('/')
						.filter((token) => token !== '');
					const tokenIdx = pathTokens.findIndex(
						(token) => token === currentVersion,
					);
					// On the latest version already.
					if (tokenIdx === -1) {
						if (newVersion === latestVersion) return;
						pathTokens.push(newVersion);
					} else {
						if (newVersion === latestVersion) {
							pathTokens.pop();
						} else {
							pathTokens[tokenIdx] = newVersion;
						}
					}
					window.location.pathname = pathTokens.join('/');
				}}
				class="appearance-none rounded-md bg-transparent py-0.5 pl-1 pr-5 tabular-nums"
			>
				{versions.map((version) => (
					<option value={version}>
						{version}
						{version === latestVersion && ' (latest)'}
					</option>
				))}
			</select>
			<div class="flex-center pointer-events-none absolute inset-0 top-0.5 left-auto flex">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="icon icon-tabler icon-tabler-chevron-down"
					width="18"
					height="18"
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

export default LanguageSelect;
