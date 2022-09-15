import mdx from '@astrojs/mdx';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import solid from '@astrojs/solid-js';
import svelte from '@astrojs/svelte';
import tailwind from '@astrojs/tailwind';
import vue from '@astrojs/vue';
import {defineConfig} from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [
		preact(),
		react(),
		mdx(),
		svelte(),
		solid(),
		tailwind(),
		vue(),
	],
	site: `http://astro.build`,
});
