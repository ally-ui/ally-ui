const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	darkMode: 'class',
	theme: {
		screens: {
			sm: '37.75rem',
			md: '50rem',
			lg: '72rem',
			'-lg': {max: '72rem'},
			'-md': {max: '50rem'},
			'-sm': {max: '37.75rem'},
		},
		extend: {
			colors: {
				accent: {
					DEFAULT: 'rgb(var(--tw-accent) / <alpha-value>)',
				},
				shade: {
					DEFAULT: 'rgb(var(--tw-shade) / <alpha-value>)',
					100: 'rgb(var(--tw-shade-100) / <alpha-value>)',
					200: 'rgb(var(--tw-shade-200) / <alpha-value>)',
					text: 'rgb(var(--tw-shade-text) / <alpha-value>)',
				},
				line: {
					DEFAULT: 'rgb(var(--tw-line) / <alpha-value>)',
				},
				word: {
					DEFAULT: 'rgb(var(--tw-word) / <alpha-value>)',
					sub: 'rgb(var(--tw-word-sub) / <alpha-value>)',
				},
			},
			fontFamily: {
				mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
			},
			height: {
				nav: '4rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('./tailwindcss/flex.cjs'),
		require('./tailwindcss/has-pointer.cjs'),
		require('./tailwindcss/overflow.cjs'),
		require('./tailwindcss/sidebar.cjs'),
		require('./tailwindcss/size.cjs'),
		require('./tailwindcss/text-scale.cjs'),
	],
};
