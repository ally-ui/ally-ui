import typescript from '@rollup/plugin-typescript';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/svelte',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['svelte'],
			plugins: [typescript()],
		},
	},
	plugins: [svelte()],
});
