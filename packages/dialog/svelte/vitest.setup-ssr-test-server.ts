import express, {type Express} from 'express';
import {createServer} from 'vite';

export default async function setup() {
	const app = await setupTestServer();
	const server = app.listen();

	const address = server.address();
	if (typeof address === 'object') {
		process.env.SVELTE_SSR_PORT = String(address?.port);
	}

	return function teardown() {
		server.close();
	};
}

let cachedApp: Express;
async function setupTestServer() {
	if (cachedApp !== undefined) {
		return cachedApp;
	}
	const app = express();
	const vite = await createServer({
		server: {middlewareMode: true},
		appType: 'custom',
		base: '/',
	});
	app.use(vite.middlewares);
	app.use('*', async (request, response) => {
		try {
			const templateName = request.originalUrl.replace('/', '');
			const {renderToString} = await vite.ssrLoadModule(
				'/tests/ssr/renderToString__server.ts',
			);
			const rendered = await renderToString(templateName);
			response
				.status(200)
				.set({'Content-Type': 'text/html'})
				.end(rendered.html);
		} catch (err: any) {
			vite.ssrFixStacktrace(err);
			console.error(err.stack);
			response.status(500).end(err.stack);
		}
	});
	cachedApp = app;
	return app;
}
