/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		screens: {
			sm: '37.75rem',
			md: '50rem',
			lg: '72rem',
		},
		extend: {},
	},
	plugins: [require('./tailwindcss/sidebar.cjs')],
};
