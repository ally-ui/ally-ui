export async function render(testName: string) {
	const Test = await import(`./tests/${testName}.svelte`);
	return Test.default.render();
}
