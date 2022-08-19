import {cleanup, render, screen} from '@testing-library/svelte';
import Initialization from './initialization.test.svelte';

afterEach(async () => {
	cleanup();
});

it('hides an initially closed dialog', () => {
	render(Initialization, {initialOpen: false});
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('shows an initially opened dialog', () => {
	render(Initialization, {initialOpen: true});
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
