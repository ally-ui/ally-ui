import type {Axis, Coord} from './types';

export function coordIsEqual(a: Coord, b: Coord) {
	return a[0] === b[0] && a[1] === b[1];
}

export function getWheelDelta(ev: WheelEvent): Coord {
	return [ev.deltaX, ev.deltaY];
}

export function getTouchCoord(ev: TouchEvent): Coord {
	const touch = ev.changedTouches[0];
	return [touch.clientX, touch.clientY];
}

export function getDeltaAxis([x, y]: Coord): Axis {
	return Math.abs(x) > Math.abs(y) ? 'h' : 'v';
}
