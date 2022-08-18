import fetch from 'node-fetch';

export async function renderServerTemplate(templateName: string) {
	const port = parseInt(process.env.TEST_SERVER_PORT ?? '');
	const response = await fetch(`http://localhost:${port}/${templateName}`);
	return await response.text();
}
