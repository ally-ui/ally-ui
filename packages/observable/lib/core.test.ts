import {beforeEach, describe, expect, it, test, vi} from 'vitest';
import {derived, isObservable, observable, writable} from './core';

let user1 = vi.fn();
let user2 = vi.fn();
let user3 = vi.fn();

beforeEach(() => {
	user1.mockClear();
	user2.mockClear();
	user3.mockClear();
});

describe('initialization', () => {
	test('the convenience function', () => {
		const value = observable(10);
		expect(isObservable(value)).toBe(true);
	});

	it('notifies on subscription', () => {
		const value = observable(10);
		value.subscribe(user1);

		expect(user1).toHaveBeenCalledWith(10);
		expect(user1).toHaveBeenCalledOnce();
	});

	it('notifies only new subscriber on subscription', () => {
		const value = observable(10);
		value.subscribe(user1);
		value.subscribe(user2);
		value.subscribe(user3);

		expect(user1).toHaveBeenCalledWith(10);
		expect(user1).toHaveBeenCalledOnce();
	});
});

describe('updating', () => {
	it('updates all subscribers on set', () => {
		const value = writable(10);
		value.subscribe(user1);
		value.subscribe(user2);
		value.subscribe(user3);

		value.set(20);

		expect(user1).toHaveBeenLastCalledWith(20);
		expect(user2).toHaveBeenLastCalledWith(20);
		expect(user3).toHaveBeenLastCalledWith(20);
	});

	it('updates all subscribers on update', () => {
		const value = writable(10);
		value.subscribe(user1);
		value.subscribe(user2);
		value.subscribe(user3);

		value.update(($value) => $value + 20);

		expect(user1).toHaveBeenLastCalledWith(30);
		expect(user2).toHaveBeenLastCalledWith(30);
		expect(user3).toHaveBeenLastCalledWith(30);
	});
});

describe('deinitialization', () => {
	it('stops updating after unsubsciption', () => {
		const value = writable(10);
		const unsubscribe = value.subscribe(user1);
		unsubscribe();
		user1.mockClear();

		value.set(20);
		expect(user1).not.toHaveBeenCalled();
	});

	it('still updates others after unsubsciption', () => {
		const value = writable(10);
		const unsubscribe = value.subscribe(user1);
		unsubscribe();
		value.subscribe(user2);
		value.subscribe(user3);

		user1.mockClear();

		value.set(20);
		expect(user1).not.toHaveBeenCalled();
		expect(user2).toHaveBeenLastCalledWith(20);
		expect(user3).toHaveBeenLastCalledWith(20);
	});
});

describe('type check', () => {
	it('returns true if object has subscribe method', () => {
		const value = observable(10);
		expect(isObservable(value)).toBe(true);
	});
	it('returns false for other objects', () => {
		expect(isObservable(10)).toBe(false);
		expect(isObservable({})).toBe(false);
	});
});

describe('derived', () => {
	it('notifies the first subscriber of the right value', () => {
		const value = observable(10);
		const derivedValue = derived(value, ($value) => $value + 10);
		derivedValue.subscribe(user1);

		expect(user1).toHaveBeenLastCalledWith(20);
		expect(user1).toHaveBeenCalledOnce();
	});

	it('updates the derived value when the original value updates', () => {
		const value = writable(10);
		const derivedValue = derived(value, ($value) => $value + 10);
		derivedValue.subscribe(user1);

		value.set(20);

		expect(user1).toHaveBeenLastCalledWith(30);
	});
});
