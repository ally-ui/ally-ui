export type Unsubscriber = () => void;
export type Subscriber<TValue> = (value: TValue) => void;
export type Updater<TValue> = (oldValue: TValue) => TValue;
export type MaybeObservable<TValue> = TValue | Observable<TValue>;

export class Observable<TValue> {
	value: TValue;
	private subscribers: Subscriber<TValue>[] = [];

	constructor(initialValue: TValue) {
		this.value = initialValue;
	}

	subscribe(subscriber: Subscriber<TValue>): Unsubscriber {
		this.subscribers.push(subscriber);
		subscriber(this.value);
		return () => {
			const idx = this.subscribers.findIndex((s) => s === subscriber);
			this.subscribers.splice(idx);
		};
	}

	update(updater: Updater<TValue>) {
		this.value = updater(this.value);
		this.#notify();
	}

	set(newValue: TValue) {
		this.value = newValue;
		this.#notify();
	}

	#notify() {
		this.subscribers.forEach((subscriber) => subscriber(this.value));
	}
}

export function observable<TValue>(initialValue: TValue) {
	return new Observable(initialValue);
}

export function isObservable(obj: unknown): obj is Observable<unknown> {
	return obj instanceof Observable;
}
