import {cleanup, render, screen} from '@testing-library/vue';
import Initialization from './initialization.test.vue';

afterEach(async () => {
	cleanup();
});

it('hides an initially closed dialog', () => {
	render(Initialization, {props: {initialOpen: false}});
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('shows an initially opened dialog', () => {
	render(Initialization, {props: {initialOpen: true}});
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
