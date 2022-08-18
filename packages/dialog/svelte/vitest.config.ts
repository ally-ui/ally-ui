import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: './vitest.setup.ts',
		globalSetup: './vitest.global.setup.ts',
	},
});
