import {mergeSvelteProps} from '../lib/main';

it('overwrites slot props with child props', () => {
	const slotProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeSvelteProps(slotProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('merges class classes', () => {
	const slotProps = {class: 'a b'};
	const childProps = {class: 'c d'};
	const merged = mergeSvelteProps(slotProps, childProps);
	expect(merged.class).toEqual('a b c d');
});

it('merges style strings', () => {
	const slotProps = {style: 'margin: 2px; background-color: red'};
	const childProps = {style: 'color: white; margin: 4px'};
	const merged = mergeSvelteProps(slotProps, childProps);
	expect(merged.style).toBe('margin:4px;background-color:red;color:white');
});
