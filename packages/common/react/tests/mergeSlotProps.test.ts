import {vi} from 'vitest';
import {mergeSlotProps} from '../lib/main';

it('overwrites slot props with child props', () => {
	const slotProps = {a: 1, b: 2};
	const childProps = {b: 3, c: 4};
	const merged = mergeSlotProps(slotProps, childProps);
	expect(merged).toStrictEqual({a: 1, b: 3, c: 4});
});

it('calls slot and child event handlers', () => {
	const slotFn = vi.fn();
	const childFn = vi.fn();
	const slotProps = {onClick: slotFn};
	const childProps = {onClick: childFn};
	const merged = mergeSlotProps(slotProps, childProps);
	const ev = new Event('click');
	merged.onClick(ev);
	expect(childFn).toBeCalledWith(ev);
	expect(slotFn).toBeCalledWith(ev);
});

it('merges className classes', () => {
	const slotProps = {className: 'a b'};
	const childProps = {className: 'c d'};
	const merged = mergeSlotProps(slotProps, childProps);
	expect(merged.className).toEqual('a b c d');
});

it('merges style objects', () => {
	const slotProps = {style: {margin: '2px', backgroundColor: 'red'}};
	const childProps = {style: {color: 'white', margin: '4px'}};
	const merged = mergeSlotProps(slotProps, childProps);
	expect(merged.style).toStrictEqual({
		margin: '4px',
		color: 'white',
		backgroundColor: 'red',
	});
});
