import {resolve} from 'path';
import {defineConfig} from 'vite';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/observable',
			fileName: 'main',
		},
		rollupOptions: {
			plugins: [typescript()],
		},
	},
});
