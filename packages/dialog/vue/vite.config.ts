import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'lib/main.ts'),
			name: '@ally-ui/vue-dialog',
			fileName: 'main',
		},
		rollupOptions: {
			external: ['vue'],
			plugins: [],
		},
	},
	plugins: [vue(), vueJsx()],
});
