import {resolve} from 'path';
import {defineConfig} from 'vite';
import typescript from '@rollup/plugin-typescript';
import {svelte} from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/svelte-utils',
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
