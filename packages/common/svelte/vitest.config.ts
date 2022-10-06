import {svelte} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins: [svelte({hot: !process.env.VITEST})],
	test: {
		environment: 'jsdom',
		setupFiles: '@ally-ui/dev/vitest.setup.ts',
		globals: true,
		transformMode: {
			web: [/\.svelte$/, /\.[jt]s$/],
		},
		deps: {
			inline: [/svelte/],
			registerNodeLoader: true,
		},
	},
});
