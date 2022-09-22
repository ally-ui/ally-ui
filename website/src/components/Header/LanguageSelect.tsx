/** @jsxImportSource preact */
import cx from 'classnames';
import type {FunctionComponent} from 'preact';
import {KNOWN_LANGUAGES} from '../../config';
import {LANG_REGEX} from '../../paths';

interface LanguageSelectProps {
	lang: string;
	alwaysShowLabel?: boolean;
}

const LanguageSelect: FunctionComponent<LanguageSelectProps> = ({
	lang,
	alwaysShowLabel = false,
}) => {
	return (
		<div className="relative text-shade-text">
			<div className="absolute top-0 bottom-0 flex pointer-events-none left-1 flex-center aspect-square">
				<svg
					width="30"
					height="30"
					viewBox="0 0 36 36"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M7.5 10.5H18M15 7.5V10.5C15 13.6826 14.2098 16.7348 12.8033 18.9853C11.3968 21.2357 9.48912 22.5 7.5 22.5M9 16.5C8.99751 18.0477 10.0418 19.5361 11.9146 20.6543C13.7874 21.7724 16.344 22.4337 19.05 22.5" />
					<path d="M16.5 28.5L22.5 15L28.5 28.5M27.15 25.5H17.85" />
				</svg>
			</div>
			<select
				className={cx(
					'flex items-center flex-grow pl-10 pr-9 rounded-full appearance-none h-10 md:w-full bg-shade-100 hover:bg-shade-100/50 cursor-pointer',
					alwaysShowLabel ? 'w-full' : 'w-10',
				)}
				value={lang}
				onInput={(ev) => {
					const newLang = ev.currentTarget.value;
					let actualDest = window.location.pathname.replace(LANG_REGEX, '/');
					window.location.pathname = '/' + newLang + actualDest;
				}}
			>
				{Object.entries(KNOWN_LANGUAGES).map(([code, lang]) => (
					<option value={code} key={code}>
						<span>{lang}</span>
					</option>
				))}
			</select>
			<div className="absolute inset-0 left-auto flex pointer-events-none flex-center aspect-square">
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

export default LanguageSelect;
