export type Subscriber<TState> = (curr: TState, prev?: TState) => void;
export type Unsubscriber = () => void;

export interface ObservableOptions {
	/**
	 * Whether new subscribers should be immediately notified with the latest
	 * value upon subscribing.
	 *
	 * Defaults to `false`.
	 */
	notifyOnSubscribe?: boolean;
}

export class Observable<TValue> {
	#options: ObservableOptions;
	constructor(options: ObservableOptions = {}) {
		if (options.notifyOnSubscribe == null) options.notifyOnSubscribe = false;
		this.#options = options;
	}

	#subscribers: Subscriber<TValue>[] = [];

	#latestValue?: TValue;
	notify(curr: TValue, prev?: TValue) {
		this.#latestValue = curr;
		this.#subscribers.forEach((subscriber) => {
			subscriber(curr, prev);
		});
	}

	/**
	 * Subscribe to value changes. Subscriber instances are de-duplicated so this
	 * method is idempotent.
	 *
	 * @param subscriber The subscriber function.
	 * @returns An unsubscriber function.
	 */
	subscribe(subscriber: Subscriber<TValue>): Unsubscriber {
		if (this.#subscribers.find((s) => s === subscriber) == null) {
			this.#subscribers.push(subscriber);
			if (this.#options.notifyOnSubscribe && this.#latestValue != null) {
				subscriber(this.#latestValue);
			}
		}
		const unsubscriber = () => {
			const idx = this.#subscribers.findIndex((s) => s === subscriber);
			this.#subscribers.splice(idx, 1);
		};
		return unsubscriber;
	}
}
