import {beforeEach, describe, expect, it, vi} from 'vitest';
import {writable} from './core';
import {keyed} from './keyed';

let user1 = vi.fn();

beforeEach(() => {
	user1.mockClear();
});

describe('keyed', () => {
	it('notifies the first subscriber of the right value', () => {
		const value = writable({age: 10});
		const keyedValue = keyed(value, 'age');
		keyedValue.subscribe(user1);

		expect(user1).toHaveBeenLastCalledWith(10);
		expect(user1).toHaveBeenCalledOnce();
	});

	it('updates the keyed value when the original value updates', () => {
		const value = writable({age: 10});
		const keyedValue = keyed(value, 'age');
		keyedValue.subscribe(user1);

		user1.mockClear();

		value.set({age: 20});

		expect(user1).toHaveBeenLastCalledWith(20);
		expect(user1).toHaveBeenCalledOnce();
	});

	it('updates the keyed value when the original value updates', () => {
		const value = writable({age: 10});
		const keyedValue = keyed(value, 'age');
		value.subscribe(user1);

		user1.mockClear();

		keyedValue.set(20);

		expect(user1).toHaveBeenLastCalledWith({age: 20});
		expect(user1).toHaveBeenCalledOnce();
	});
});
