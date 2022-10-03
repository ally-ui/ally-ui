import {mergeSolidProps} from '../lib/main';

it('overwrites parent props with child props', () => {
	const parentProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('calls parent and child event handlers', () => {
	const parentFn = vi.fn();
	const childFn = vi.fn();
	const parentProps = {onClick: parentFn};
	const childProps = {onClick: childFn};
	const merged = mergeSolidProps(parentProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(ev);
	expect(parentFn).toBeCalledWith(ev);
});

it('calls parent and child bound event handlers', () => {
	const parentFn = vi.fn();
	const childFn = vi.fn();
	const parentProps = {onClick: [parentFn, 123]};
	const childProps = {onClick: [childFn, 456]};
	const merged = mergeSolidProps(parentProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(456, ev);
	expect(parentFn).toBeCalledWith(123, ev);
});

it('merges className classes', () => {
	const parentProps = {className: 'a b'};
	const childProps = {className: 'c d'};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.className).toEqual('a b c d');
});

it('merges class classes', () => {
	const parentProps = {class: 'a b'};
	const childProps = {class: 'c d'};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.class).toEqual('a b c d');
});

it('merges classList objects', () => {
	const parentProps = {classList: {a: true, b: false}};
	const childProps = {classList: {a: false, c: true}};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.classList).toEqual({a: false, b: false, c: true});
});

it('merges style objects', () => {
	const parentProps = {style: {margin: '2px', 'background-color': 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges style strings', () => {
	const parentProps = {style: 'margin: 2px; background-color: red'};
	const childProps = {style: 'color: white; margin: 4px'};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges style object and string', () => {
	const parentProps = {style: 'margin: 2px; background-color: red'};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeSolidProps(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges multiple child props', () => {
	const parentProps = {a: 1, b: 2, style: 'margin: 2px; background-color: red'};
	const childProps = {b: 3, c: 4, style: 'color: white; margin: 4px'};
	const nextChildProps = {b: 4, d: 5, style: 'color: blue; padding: 2px;'};
	const merged = mergeSolidProps(parentProps, childProps, nextChildProps);
	expect(merged).toStrictEqual({
		a: 1,
		b: 4,
		c: 4,
		d: 5,
		style: {
			margin: '4px',
			'background-color': 'red',
			color: 'blue',
			padding: '2px',
		},
	});
});
