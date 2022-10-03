import {mergeVueProps} from '../lib/main';

it('overwrites parent props with child props', () => {
	const parentProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeVueProps(parentProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('merges classes', () => {
	const parentProps = {class: 'a b'};
	const childProps = {class: {c: true, d: false}};
	const merged = mergeVueProps(parentProps, childProps);
	expect(merged.class).toEqual(['a b', {c: true, d: false}]);
});

it('merges array of classes', () => {
	const parentProps = {class: ['a b', 'c d', {c: false}]};
	const childProps = {class: [{c: true, d: false}]};
	const merged = mergeVueProps(parentProps, childProps);
	expect(merged.class).toEqual(['a b', 'c d', {c: true, d: false}]);
});

it('merges style objects', () => {
	const parentProps = {style: {margin: '2px', 'background-color': 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeVueProps(parentProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});
