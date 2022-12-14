import typescript from '@rollup/plugin-typescript';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/react-dialog',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['react', 'react-dom', /@ally-ui\/[\w-]+/],
			plugins: [
				typescript({
					tsconfig: './tsconfig.build.json',
				}),
			],
		},
	},
	plugins: [react()],
});
