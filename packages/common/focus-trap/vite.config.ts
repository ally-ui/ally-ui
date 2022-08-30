/// <reference types="vitest" />
import typescript from '@rollup/plugin-typescript';
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/focus-trap',
			fileName: 'main',
		},
		rollupOptions: {
			external: [/@ally-ui\/[\w-]+/],
			plugins: [
				typescript({
					tsconfig: './tsconfig.build.json',
				}),
			],
		},
	},
});
