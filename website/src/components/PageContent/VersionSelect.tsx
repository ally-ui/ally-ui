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
		<select
			value={currentVersion ?? latestVersion}
			onInput={(ev) => {
				const newVersion = ev.currentTarget.value;
				const pathTokens = window.location.pathname.split('/');
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
		>
			{versions.map((version) => (
				<option value={version}>{version}</option>
			))}
		</select>
	);
};

export default LanguageSelect;
