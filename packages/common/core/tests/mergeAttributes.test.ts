import {mergeAttributes} from '../lib/main';

it('overwrites parent props with child props', () => {
	const parentProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeAttributes(parentProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('merges classes', () => {
	const parentProps = {class: 'a b'};
	const childProps = {class: 'c d'};
	const merged = mergeAttributes(parentProps, childProps);
	expect(merged.class).toEqual('a b c d');
});

it('merges style objects', () => {
	const parentProps = {style: {margin: '2px', 'background-color': 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeAttributes(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges undefined style objects', () => {
	const parentProps = {};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeAttributes(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
	});
});

it('merges multiple child props', () => {
	const parentProps = {
		a: 1,
		b: 2,
		style: {margin: '2px', 'background-color': 'red'},
	};
	const childProps = {b: 3, c: 4, style: {color: 'white', margin: '4px'}};
	const nextChildProps = {b: 4, d: 5, style: {color: 'blue', padding: '2px'}};
	const merged = mergeAttributes(parentProps, childProps, nextChildProps);
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
