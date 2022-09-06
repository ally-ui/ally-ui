import {svelte} from '@sveltejs/vite-plugin-svelte';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins: [svelte({hot: !process.env.VITEST})],
	test: {
		environment: 'jsdom',
		setupFiles: '@ally-ui/dev/vitest.setup.ts',
		globalSetup: './vitest.setup-ssr-test-server.ts',
		globals: true,
		deps: {inline: [/svelte/]},
	},
});
