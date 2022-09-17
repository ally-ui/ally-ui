/** @jsxImportSource react */
import type {FunctionComponent} from 'react';
import {KNOWN_LANGUAGES, langPathRegex} from '../../languages';

const LanguageSelect: FunctionComponent<{lang: string}> = ({lang}) => {
	return (
		<div className="relative text-shade-text">
			<div className="absolute inset-0 right-auto flex pointer-events-none left-1 flex-center aspect-square">
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
				className="flex items-center flex-grow px-4 pl-10 rounded-full wh-10 md:w-full bg-shade-100"
				value={lang}
				onChange={(e) => {
					const newLang = e.target.value;
					let actualDest = window.location.pathname.replace(langPathRegex, '/');
					if (actualDest == '/') actualDest = `/introduction`;
					window.location.pathname = '/' + newLang + actualDest;
				}}
			>
				{Object.entries(KNOWN_LANGUAGES).map(([key, value]) => {
					return (
						<option value={value} key={value}>
							<span>{key}</span>
						</option>
					);
				})}
			</select>
		</div>
	);
};

export default LanguageSelect;
