import {type TObservable} from './core';

export type Unsubscriber = () => void;
export type Subscriber<TValue> = (value: TValue) => void;
export type Updater<TValue> = (oldValue: TValue) => TValue;
export type MaybeObservable<TValue> = TValue | TObservable<TValue>;
export type Runner<TValue> = (set: (newValue: TValue) => void) => Unsubscriber;

export {keyed} from './keyed';
