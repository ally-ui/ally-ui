import {expect, it} from 'vitest';
import {renderServerTemplate} from '../renderServerTemplate';

it('renders an initially closed dialog', async () => {
	const rendered = await renderServerTemplate('initialization--closed');
	expect(rendered).not.toContain('title');
});

it('renders an initially closed dialog', async () => {
	const rendered = await renderServerTemplate('initialization--open');
	expect(rendered).toContain('title');
	expect(rendered).toContain('description');
});
