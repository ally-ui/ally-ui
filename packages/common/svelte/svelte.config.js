import sveltePreprocess from 'svelte-preprocess';

export default {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: sveltePreprocess(),
	package: {
		source: 'lib',
		dir: 'dist',
		exports: (filepath) => filepath === 'main.ts',
		metadata: () => false,
	},
};
