import {screen} from '@testing-library/dom';
import {createSSRApp} from 'vue';
import {renderToString} from 'vue/server-renderer';
import RenderedClosed from './init--closed.test.vue';
import RenderedOpen from './init--open.test.vue';

let rendered_open: string;
let rendered_closed: string;
beforeAll(async () => {
	rendered_open = await renderToString(createSSRApp(RenderedOpen));
	rendered_closed = await renderToString(createSSRApp(RenderedClosed));
});
afterEach(() => {
	document.body.innerHTML = '';
});

it('renders an initially closed dialog', () => {
	document.body.innerHTML = rendered_closed;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).toBeNull();
	expect(screen.queryByTestId('title')).toBeNull();
	expect(screen.queryByTestId('description')).toBeNull();
	expect(screen.queryByTestId('close')).toBeNull();
});

it('renders an initially opened dialog', () => {
	document.body.innerHTML = rendered_open;
	expect(screen.queryByTestId('trigger')).not.toBeNull();
	expect(screen.queryByTestId('content')).not.toBeNull();
	expect(screen.queryByTestId('title')).not.toBeNull();
	expect(screen.queryByTestId('description')).not.toBeNull();
	expect(screen.queryByTestId('close')).not.toBeNull();
});
