import typescript from '@rollup/plugin-typescript';
import {resolve} from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/dev',
			fileName: 'main',
		},
		rollupOptions: {
			plugins: [typescript()],
		},
	},
});
