import {vi} from 'vitest';
import {mergeSolidProps} from '../lib/main';

it('overwrites slot props with child props', () => {
	const slotProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('calls slot and child event handlers', () => {
	const slotFn = vi.fn();
	const childFn = vi.fn();
	const slotProps = {onClick: slotFn};
	const childProps = {onClick: childFn};
	const merged = mergeSolidProps(slotProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(ev);
	expect(slotFn).toBeCalledWith(ev);
});

it('calls slot and child bound event handlers', () => {
	const slotFn = vi.fn();
	const childFn = vi.fn();
	const slotProps = {onClick: [slotFn, 123]};
	const childProps = {onClick: [childFn, 456]};
	const merged = mergeSolidProps(slotProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(456, ev);
	expect(slotFn).toBeCalledWith(123, ev);
});

it('merges className classes', () => {
	const slotProps = {className: 'a b'};
	const childProps = {className: 'c d'};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.className).toEqual('a b c d');
});

it('merges class classes', () => {
	const slotProps = {class: 'a b'};
	const childProps = {class: 'c d'};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.class).toEqual('a b c d');
});

it('merges classList objects', () => {
	const slotProps = {classList: {a: true, b: false}};
	const childProps = {classList: {a: false, c: true}};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.classList).toEqual({a: false, b: false, c: true});
});

it('merges style objects', () => {
	const slotProps = {style: {margin: '2px', 'background-color': 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges style strings', () => {
	const slotProps = {style: 'margin: 2px; background-color: red'};
	const childProps = {style: 'color: white; margin: 4px'};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});

it('merges style object and string', () => {
	const slotProps = {style: 'margin: 2px; background-color: red'};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeSolidProps(slotProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		'background-color': 'red',
	});
});
