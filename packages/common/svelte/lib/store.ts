import type {Readable, Writable} from 'svelte/store';

export type MaybeReadable<TValue> = TValue | Readable<TValue>;
export type MaybeWritable<TValue> = TValue | Writable<TValue>;
export type ReadOrWritable<TValue> = Readable<TValue> | Writable<TValue>;
export type MaybeReadOrWritable<TValue> = TValue | ReadOrWritable<TValue>;

export function isReadable<TValue = unknown>(
	obj: TValue | Readable<TValue>,
): obj is Readable<TValue> {
	return typeof obj === 'object' && 'subscribe' in obj;
}

export function isWritable<T = unknown>(
	obj: T | ReadOrWritable<T>,
): obj is Writable<T> {
	return isReadable(obj) && 'set' in obj && 'update' in obj;
}
