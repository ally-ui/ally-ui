const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		screens: {
			sm: '37.75rem',
			md: '50rem',
			lg: '72rem',
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
			},
			fontFamily: {
				mono: ['IBM Plex Mono', ...defaultTheme.fontFamily.mono],
			},
			height: {
				nav: '6rem',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('./tailwindcss/has-pointer.cjs'),
		require('./tailwindcss/sidebar.cjs'),
	],
};