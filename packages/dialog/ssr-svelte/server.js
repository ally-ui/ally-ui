import express from 'express';
import {createServer} from 'vite';

export async function startSSRTestServer() {
	const port = process.env.PORT || 5173;
	const base = process.env.BASE || '/';
	const app = express();

	const vite = await createServer({
		server: {middlewareMode: true},
		appType: 'custom',
		base,
	});

	app.use(vite.middlewares);

	app.use('*', async (req, res) => {
		try {
			const url = req.originalUrl.replace(base, '');
			const {render} = await vite.ssrLoadModule('/src/entry-server.ts');
			const rendered = await render(url, undefined);
			res.status(200).set({'Content-Type': 'text/html'}).end(rendered.html);
		} catch (err) {
			vite?.ssrFixStacktrace(err);
			console.log(err.stack);
			res.status(500).end(err.stack);
		}
	});

	app.listen(port, () => {
		console.log(`SSR test server started at http://localhost:${port}`);
	});

	return port;
}
