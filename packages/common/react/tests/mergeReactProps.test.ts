import {mergeReactProps} from '../lib/main';

it('overwrites parent props with child props', () => {
	const parentProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeReactProps(parentProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('calls parent and child event handlers', () => {
	const parentFn = vi.fn();
	const childFn = vi.fn();
	const parentProps = {onClick: parentFn};
	const childProps = {onClick: childFn};
	const merged = mergeReactProps(parentProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(ev);
	expect(parentFn).toBeCalledWith(ev);
});

it('merges className classes', () => {
	const parentProps = {className: 'a b'};
	const childProps = {className: 'c d'};
	const merged = mergeReactProps(parentProps, childProps);
	expect(merged.className).toEqual('a b c d');
});

it('merges style objects', () => {
	const parentProps = {style: {margin: '2px', backgroundColor: 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeReactProps(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		backgroundColor: 'red',
	});
});
