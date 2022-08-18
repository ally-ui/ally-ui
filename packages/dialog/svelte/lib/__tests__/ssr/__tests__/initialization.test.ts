import {screen} from '@testing-library/dom';
import {expect, it} from 'vitest';
import {renderServerTemplate} from '../renderServerTemplate';

it('renders an initially closed dialog', async () => {
	const rendered = await renderServerTemplate('init--closed');
	document.body.innerHTML = rendered;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('renders an initially opened dialog', async () => {
	const rendered = await renderServerTemplate('init--open');
	document.body.innerHTML = rendered;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
