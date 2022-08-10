import {describe, expect, it, test, vi} from 'vitest';
import {isObservable, Observable, observable} from './main';

const SUBSCRIBERS = {
	user1() {},
	user2() {},
	user3() {},
};

describe('initialization', () => {
	test('the convenience function', () => {
		const value = observable(10);
		expect(value).toBeInstanceOf(Observable);
	});

	it('updates on subscription', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');

		const value = observable(10);
		value.subscribe(SUBSCRIBERS.user1);

		expect(user1Spy).toHaveBeenCalledWith(10);
		expect(user1Spy).toHaveBeenCalledOnce();
	});

	it('updates only new subscriber on subscription', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');

		const value = observable(10);
		value.subscribe(SUBSCRIBERS.user2);
		value.subscribe(SUBSCRIBERS.user3);
		value.subscribe(SUBSCRIBERS.user1);

		expect(user1Spy).toHaveBeenCalledWith(10);
		expect(user1Spy).toHaveBeenCalledOnce();
	});
});

describe('updating', () => {
	it('updates all subscribers on set', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');
		const user2Spy = vi.spyOn(SUBSCRIBERS, 'user2');
		const user3Spy = vi.spyOn(SUBSCRIBERS, 'user3');

		const value = observable(10);
		value.subscribe(SUBSCRIBERS.user1);
		value.subscribe(SUBSCRIBERS.user2);
		value.subscribe(SUBSCRIBERS.user3);

		value.set(20);

		expect(user1Spy).toHaveBeenLastCalledWith(20);
		expect(user2Spy).toHaveBeenLastCalledWith(20);
		expect(user3Spy).toHaveBeenLastCalledWith(20);
	});

	it('updates all subscribers on update', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');
		const user2Spy = vi.spyOn(SUBSCRIBERS, 'user2');
		const user3Spy = vi.spyOn(SUBSCRIBERS, 'user3');

		const value = observable(10);
		value.subscribe(SUBSCRIBERS.user1);
		value.subscribe(SUBSCRIBERS.user2);
		value.subscribe(SUBSCRIBERS.user3);

		value.update(($value) => $value + 20);

		expect(user1Spy).toHaveBeenLastCalledWith(30);
		expect(user2Spy).toHaveBeenLastCalledWith(30);
		expect(user3Spy).toHaveBeenLastCalledWith(30);
	});
});

describe('deinitialization', () => {
	it('stops updating after unsubsciption', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');

		const value = observable(10);
		const unsubscribe = value.subscribe(SUBSCRIBERS.user1);
		unsubscribe();
		user1Spy.mockClear();

		value.set(20);
		expect(user1Spy).not.toHaveBeenCalled();
	});

	it('still updates others after unsubsciption', () => {
		const user1Spy = vi.spyOn(SUBSCRIBERS, 'user1');
		const user2Spy = vi.spyOn(SUBSCRIBERS, 'user2');
		const user3Spy = vi.spyOn(SUBSCRIBERS, 'user3');

		const value = observable(10);
		const unsubscribe = value.subscribe(SUBSCRIBERS.user1);
		unsubscribe();
		value.subscribe(SUBSCRIBERS.user2);
		value.subscribe(SUBSCRIBERS.user3);

		user1Spy.mockClear();

		value.set(20);
		expect(user1Spy).not.toHaveBeenCalled();
		expect(user2Spy).toHaveBeenLastCalledWith(20);
		expect(user3Spy).toHaveBeenLastCalledWith(20);
	});
});

describe('isObservable', () => {
	it('returns true for Observable objects', () => {
		const value = observable(10);
		expect(isObservable(value)).toBe(true);
	});
	it('returns false for other objects', () => {
		expect(isObservable(10)).toBe(false);
		expect(isObservable({})).toBe(false);
		expect(isObservable({subscribe: () => {}})).toBe(false);
	});
});
