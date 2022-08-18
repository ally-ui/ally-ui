import express from 'express';
import request from 'supertest';
import {createServer} from 'vite';

const PORT = 0;
const BASE_URL = '/';

async function createTemplateServer() {
	const app = express();
	const vite = await createServer({
		server: {middlewareMode: true},
		appType: 'custom',
		base: BASE_URL,
	});
	app.use(vite.middlewares);
	app.use('*', async (request, response) => {
		try {
			const templateName = request.originalUrl.replace(BASE_URL, '');
			const {render} = await vite.ssrLoadModule(
				'/lib/__tests__/ssr/renderer.ts',
			);
			const rendered = await render(templateName);
			response
				.status(200)
				.set({'Content-Type': 'text/html'})
				.end(rendered.html);
		} catch (err: any) {
			vite?.ssrFixStacktrace(err);
			console.log(err.stack);
			response.status(500).end(err.stack);
		}
	});
	app.listen(PORT);
	return app;
}

let cachedServer: Express.Application | undefined;
export async function renderServerTemplate(templateName: string) {
	const server = cachedServer ?? (await createTemplateServer());
	cachedServer = server;
	const requestBuilder = request(server).get(`/${templateName}`);
	const response = await requestBuilder.send();
	return response.text;
}
