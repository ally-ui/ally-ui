export type Coord = [number, number];
export type Axis = 'h' | 'v';
export interface QueuedEvent {
	name: string;
	delta: Coord;
	target: Element;
	shouldPrevent: boolean;
}
