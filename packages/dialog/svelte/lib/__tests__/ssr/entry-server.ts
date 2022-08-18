export async function render(testName: string) {
	const Test = await import(`./__tests__/${testName}.svelte`);
	return Test.default.render();
}
