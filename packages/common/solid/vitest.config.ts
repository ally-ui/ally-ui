import solid from 'vite-plugin-solid';
import {defineConfig} from 'vitest/config';

export default defineConfig({
	plugins: [solid()],
	test: {
		environment: 'jsdom',
		setupFiles: '@ally-ui/dev/vitest.setup.ts',
		globals: true,
		transformMode: {web: [/[jt]sx?$/]},
		deps: {registerNodeLoader: true},
	},
});
