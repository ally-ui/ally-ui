import typescript from '@rollup/plugin-typescript';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/svelte-dialog',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['svelte'],
			output: {
				globals: {
					react: 'Svelte',
				},
			},
			plugins: [typescript()],
		},
	},
	plugins: [svelte()],
});