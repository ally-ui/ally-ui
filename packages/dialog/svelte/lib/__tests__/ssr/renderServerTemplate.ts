import express, {type Express} from 'express';
import request from 'supertest';
import {createServer} from 'vite';

let cachedApp: Express;
export async function createTemplateServer() {
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
			const {render} = await vite.ssrLoadModule(
				'/lib/__tests__/ssr/renderer.ts',
			);
			const rendered = await render(templateName);
			response
				.status(200)
				.set({'Content-Type': 'text/html'})
				.end(rendered.html);
		} catch (err: any) {
			vite.ssrFixStacktrace(err);
			console.log(err.stack);
			response.status(500).end(err.stack);
		}
	});
	cachedApp = app;
	return app;
}

export async function renderServerTemplate(templateName: string) {
	const server = await createTemplateServer();
	const requestBuilder = request(server).get(`/${templateName}`);
	const response = await requestBuilder.send();
	return response.text;
}
