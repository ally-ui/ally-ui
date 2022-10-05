export type Subscriber<TState> = (curr: TState, prev?: TState) => void;
export type Listener = () => void;
export type Unsubscriber = () => void;

export class Observable<TValue> {
	#subscribers: Subscriber<TValue>[] = [];

	#latestValue?: TValue;
	notify(curr: TValue, prev?: TValue) {
		this.#latestValue = curr;
		this.#subscribers.forEach((subscriber) => {
			subscriber(curr, prev);
		});
	}

	/**
	 * Subscribe to value changes. The latest value will be pushed on first
	 * subscription so this is useful for tracking some state.
	 *
	 * Subscriber instances are de-duplicated so this method is idempotent.
	 *
	 * @param subscriber The subscriber function.
	 * @returns An unsubscriber function.
	 */
	subscribe(subscriber: Subscriber<TValue>): Unsubscriber {
		if (this.#subscribers.find((s) => s === subscriber) == null) {
			this.#subscribers.push(subscriber);
			if (this.#latestValue != null) {
				subscriber(this.#latestValue);
			}
		}
		const unsubscriber = () => {
			const idx = this.#subscribers.findIndex((s) => s === subscriber);
			this.#subscribers.splice(idx, 1);
		};
		return unsubscriber;
	}

	/**
	 * Listen for events. The listener is not informed on subscription and will
	 * only receive messages fired after subscription.
	 *
	 * @param listener The listener function.
	 * @returns An unsubscriber function.
	 */
	listen(listener: Listener): Unsubscriber {
		if (this.#subscribers.find((s) => s === listener) == null) {
			this.#subscribers.push(listener);
		}
		const unsubscriber = () => {
			const idx = this.#subscribers.findIndex((s) => s === listener);
			this.#subscribers.splice(idx, 1);
		};
		return unsubscriber;
	}

	/**
	 * Listen for events, but automatically unsubscribe once a message is received.
	 *
	 * @param listener The listener function.
	 */
	listenOnce(listener: Listener) {
		const onceListener = () => {
			listener();
			const idx = this.#subscribers.findIndex((s) => s === onceListener);
			this.#subscribers.splice(idx, 1);
		};
		if (this.#subscribers.find((s) => s === listener) == null) {
			this.#subscribers.push(onceListener);
		}
	}
}
