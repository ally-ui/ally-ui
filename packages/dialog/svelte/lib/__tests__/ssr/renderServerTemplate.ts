import express from 'express';
import type {Server} from 'http';
import request from 'supertest';
import {createServer} from 'vite';

async function createTemplateServer() {
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
	return app;
}

let cachedServer: Server;
export async function renderServerTemplate(templateName: string) {
	const server = cachedServer ?? (await createTemplateServer());
	cachedServer = server;
	const requestBuilder = request(server).get(`/${templateName}`);
	const response = await requestBuilder.send();
	return response.text;
}
