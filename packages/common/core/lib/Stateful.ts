import {Observable} from './Observable';

export type Updater<TState> = ((prev: TState) => TState) | TState;

/**
 * A base construct for a stateful model that is decoupled from its state
 * implementation. This allows for bindings to a variety of state
 * implementations e.g. React `useState`, Svelte `writable`, and more.
 */
export class Stateful<TValue> {
	initialValue: TValue;
	#prevValue: TValue;
	/**
	 * The current value of the model. This should be controlled by the state
	 * implementation.
	 */
	#currValue: TValue;

	#observable: Observable<TValue>;

	constructor(initialValue: TValue) {
		this.initialValue = initialValue;
		this.#prevValue = initialValue;
		this.#currValue = initialValue;
		this.#observable = new Observable({notifyOnSubscribe: true});
		this.#observable.notify(initialValue);
	}

	/**
	 * Called by the model when it **wants** to update its value. It is up to the
	 * state implementation to respond to the update request and trigger any
	 * side-effects e.g. updating the DOM.
	 */
	requestUpdate?: (updater: Updater<TValue>) => void;

	get value(): TValue {
		return this.#currValue;
	}

	/**
	 * Update the model's internal value.
	 *
	 * **This should only be called by an external state implementation**.
	 *
	 * Internal value updates should be dispatched via `requestUpdate`.
	 *
	 * @param newValue The new value.
	 */
	setValue(newValue: TValue) {
		this.#prevValue = this.#currValue;
		this.#currValue = newValue;
		this.#observable.notify(newValue, this.#prevValue);
	}

	get subscribe() {
		return this.#observable.subscribe;
	}
}
