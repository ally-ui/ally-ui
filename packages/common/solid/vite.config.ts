import typescript from '@rollup/plugin-typescript';
import {resolve} from 'path';
import {defineConfig} from 'vite';
import solid from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/solid',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['solid-js'],
			plugins: [
				typescript({
					tsconfig: './tsconfig.build.json',
				}),
			],
		},
	},
	plugins: [solid()],
});
