export type Subscriber<TState> = (state: TState, prev?: TState) => void;
export type Unsubscriber = () => void;
export type Updater<TState> = ((prev: TState) => TState) | TState;

/**
 * A base construct for a stateful model that is decoupled from its state
 * implementation. This allows for bindings to a variety of state
 * implementations e.g. React `useState`, Svelte `writable`, and more.
 */
export abstract class StateModel<TState> {
	initialState: TState;
	#prev: TState;
	/**
	 * The current state of the model. This should be controlled by the state
	 * implementation.
	 */
	#state: TState;
	/**
	 * Called by the core model when it **wants** to update state. It is up to
	 * the state implementation to respond to the state update request and
	 * trigger any side-effects e.g. updating the DOM.
	 */
	requestStateUpdate?: (updater: Updater<TState>) => void;
	debug = false;

	constructor(initialState: TState) {
		this.initialState = initialState;
		this.#prev = initialState;
		this.#state = initialState;
		this.#notifySubscribers(this.#state);
	}

	get state(): TState {
		return this.#state;
	}

	/**
	 * Update the model's internal state.
	 *
	 * **This should only be called by an external state implementation**.
	 *
	 * Internal state updates should be dispatched via `options.requestStateUpdate`.
	 *
	 * @param newState The new state value.
	 */
	setState(newState: TState) {
		this.#prev = this.#state;
		this.#state = newState;
		this.#notifySubscribers(newState, this.#prev);
	}

	#subscribers: Subscriber<TState>[] = [];

	#notifySubscribers(state: TState, prev?: TState) {
		this.#subscribers.forEach((subscriber) => {
			subscriber(state, prev);
		});
	}

	/**
	 * Subscribe to state changes in the state model. Subscriber instances are
	 * de-duplicated so this method is idempotent.
	 *
	 * @param subscriber The subscriber function.
	 * @returns An unsubscriber function.
	 */
	subscribeState(subscriber: Subscriber<TState>): Unsubscriber {
		if (this.#subscribers.find((s) => s === subscriber) == null) {
			this.#subscribers.push(subscriber);
			subscriber(this.#state);
		}
		const unsubscriber = () => {
			const idx = this.#subscribers.findIndex((s) => s === subscriber);
			this.#subscribers.splice(idx, 1);
		};
		return unsubscriber;
	}
}
