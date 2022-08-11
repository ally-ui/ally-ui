import isEqual from 'lodash.isequal';
import type {Runner, Subscriber, Unsubscriber, Updater} from './main';

export interface TObservable<TValue> {
	subscribe: (subscriber: Subscriber<TValue>) => Unsubscriber;
	unsafeValue: TValue;
}

export class ObservableImpl<TValue> implements TObservable<TValue> {
	unsafeValue: TValue;
	#subscribers: Subscriber<TValue>[] = [];

	#runner?: Runner<TValue>;
	#unsubscribeRunner?: Unsubscriber;
	constructor(initialValue: TValue | undefined, runner: Runner<TValue>);
	constructor(initialValue: TValue, runner?: Runner<TValue>) {
		this.unsafeValue = initialValue;
		this.#runner = runner;
	}

	#subscriberCount = 0;
	subscribe(subscriber: Subscriber<TValue>): Unsubscriber {
		// Initialize runner on first subscriber.
		if (this.#subscriberCount === 0 && this.#runner !== undefined) {
			this.#unsubscribeRunner = this.#runner(this.internal_set);
		}
		this.#subscriberCount++;
		this.#subscribers.push(subscriber);
		subscriber(this.unsafeValue);
		return () => {
			this.#subscriberCount--;
			// Unsubscribe runner on last subscriber.
			if (
				this.#subscriberCount === 0 &&
				this.#unsubscribeRunner !== undefined
			) {
				this.#unsubscribeRunner();
				this.#unsubscribeRunner = undefined;
			}
			const idx = this.#subscribers.findIndex((s) => s === subscriber);
			this.#subscribers.splice(idx, 1);
		};
	}

	protected internal_set = (newValue: TValue) => {
		if (isEqual(this.unsafeValue, newValue)) {
			return;
		}
		this.unsafeValue = newValue;
		this.#notify();
	};

	#notify() {
		this.#subscribers.forEach((subscriber) => subscriber(this.unsafeValue));
	}
}

export interface TWritable<TValue> extends TObservable<TValue> {
	update: (updater: Updater<TValue>) => void;
	set: (newValue: TValue) => void;
}

export class WritableImpl<TValue>
	extends ObservableImpl<TValue>
	implements TWritable<TValue>
{
	constructor(initialValue: TValue | undefined, runner: Runner<TValue>);
	constructor(initialValue: TValue, runner?: Runner<TValue>) {
		super(initialValue, runner!);
	}

	update(updater: Updater<TValue>) {
		this.internal_set(updater(this.unsafeValue));
	}

	set(newValue: TValue) {
		this.internal_set(newValue);
	}
}

export function observable<TValue>(
	initialValue: TValue | undefined,
	runner: Runner<TValue>,
): TObservable<TValue>;

export function observable<TValue>(
	initialValue: TValue,
	runner?: Runner<TValue>,
): TObservable<TValue>;

export function observable<TValue>(
	initialValue: TValue,
	runner?: Runner<TValue>,
) {
	return new ObservableImpl(initialValue, runner!);
}

export function isObservable(obj: unknown): obj is TObservable<unknown> {
	return obj != null && typeof obj === 'object' && 'subscribe' in obj;
}

export function writable<TValue>(
	initialValue: TValue | undefined,
	runner: Runner<TValue>,
): TWritable<TValue>;

export function writable<TValue>(
	initialValue: TValue,
	runner?: Runner<TValue>,
): TWritable<TValue>;

export function writable<TValue>(
	initialValue: TValue,
	runner?: Runner<TValue>,
) {
	return new WritableImpl(initialValue, runner!);
}

export function isWritable(obj: unknown): obj is TWritable<unknown> {
	return isObservable(obj) && 'update' in obj && 'set' in obj;
}

export function derived<TParent, TDerived>(
	parent: TObservable<TParent>,
	deriveFn: ($parent: TParent) => TDerived,
): TObservable<TDerived> {
	return observable<TDerived>(undefined, (set) => {
		return parent.subscribe(($parent) => {
			set(deriveFn($parent));
		});
	});
}
