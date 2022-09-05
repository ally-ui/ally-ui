export type Updater<TState> = ((prevState: TState) => TState) | TState;

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
		this.watchStateChange?.(newState, this.#prev);
	}

	/**
	 * Watch for changes to state and trigger any effects in the core model.
	 *
	 * Note we cannot call this during `constructor` because the prototype of the
	 * implementing object would not have been set yet.
	 *
	 * @param newState The new state.
	 * @param prev The previous state.
	 */
	watchStateChange?(newState: TState, prev: TState): void;
}
