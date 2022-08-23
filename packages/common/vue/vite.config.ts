import typescript from '@rollup/plugin-typescript';
import vue from '@vitejs/plugin-vue';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/vue',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['vue'],
			plugins: [
				typescript({
					tsconfig: './tsconfig.build.json',
				}),
			],
		},
	},
	plugins: [vue()],
});
