/**
 * Render a Svelte template in a server environment by using Vite's SSR loader.
 *
 * This should only be called from a server environment after loading the file
 * with `vite.ssrLoadModule`.
 *
 * @param templateName The name of the template file in `tests/ssr/tests/` without `.svelte`
 * @returns The server-rendered output of the Svelte component.
 */
export async function renderToString(templateName: string) {
	const Test = await import(`./tests/${templateName}.svelte`);
	return Test.default.render();
}
