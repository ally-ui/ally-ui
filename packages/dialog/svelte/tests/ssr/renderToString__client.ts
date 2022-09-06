import fetch from 'node-fetch';

/**
 * Render a Svelte template in a test environment by dispatching a fetch
 * request to a pre-configured test server.
 *
 * This should only be called from `test.ts` files.
 *
 * @param templateName The name of the template file in `tests/ssr/tests/` without `.svelte`
 * @returns The server-rendered output of the Svelte component.
 */
export async function renderToString(templateName: string) {
	const port = parseInt(process.env.SVELTE_SSR_PORT ?? '');
	const response = await fetch(`http://localhost:${port}/${templateName}`);
	return await response.text();
}
