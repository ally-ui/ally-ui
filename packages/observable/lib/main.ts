import {type TObservable} from './core';

export type Unsubscriber = () => void;
export type Subscriber<TValue> = (value: TValue) => void;
export type Updater<TValue> = (oldValue: TValue) => TValue;
export type MaybeObservable<TValue> = TValue | TObservable<TValue>;
export type Runner<TValue> = (set: (newValue: TValue) => void) => Unsubscriber;

export {
	type TObservable,
	type TWritable,
	observable,
	writable,
	derived,
	isObservable,
	isWritable,
} from './core';
export {keyed} from './keyed';
