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

it('merges multiple chlid props', () => {
	const slotProps = {a: 1, b: 2, style: 'margin: 2px; background-color: red'};
	const childProps = {b: 3, c: 4, style: 'color: white; margin: 4px'};
	const nextChildProps = {b: 4, d: 5, style: 'color: blue; padding: 2px;'};
	const merged = mergeSvelteProps(slotProps, childProps, nextChildProps);
	expect(merged).toStrictEqual({
		a: 1,
		b: 4,
		c: 4,
		d: 5,
		style: 'margin:4px;background-color:red;color:blue;padding:2px',
	});
});
