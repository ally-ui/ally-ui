import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		setupFiles: '@ally-ui/dev/vitest.setup.ts',
		globals: true,
	},
});
