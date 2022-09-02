export type Updater<TState> = ((oldState: TState) => TState) | TState;

export interface StateOptions<TState> {
	/**
	 * Called by the core model when it **wants** to update state. It is up to
	 * the state implementation to respond to the state update request and
	 * trigger any side-effects e.g. updating the DOM.
	 */
	requestStateUpdate?: (updater: Updater<TState>) => void;
	debug?: boolean;
}

/**
 * A base construct for a stateful model that is decoupled from its state
 * implementation. This allows for bindings to a variety of state
 * implementations e.g. React `useState`, Svelte `writable`, and more.
 *
 * The model is initialized with a set of initial options. These options can be
 * reactively updated by the state implementation with `setOptions`.
 */
export abstract class StateModel<TState> {
	initialState: TState;
	#previousState: TState;
	/**
	 * The current state of the model. This should be controlled by the state
	 * implementation.
	 */
	#state: TState;
	#stateOptions: StateOptions<TState>;

	constructor(initialState: TState) {
		this.initialState = initialState;
		this.#previousState = initialState;
		this.#state = initialState;
		this.#stateOptions = {};
	}

	getStateOptions() {
		return this.#stateOptions;
	}

	setStateOptions(updater: Updater<StateOptions<TState>>) {
		if (updater instanceof Function) {
			this.#stateOptions = updater(this.#stateOptions);
		} else {
			this.#stateOptions = updater;
		}
	}

	getState(): TState {
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
		this.#previousState = this.#state;
		this.#state = newState;
		this.watchStateChange?.(newState, this.#previousState);
	}

	/**
	 * Watch for changes to state and trigger any effects in the core model.
	 * @param newState The new state.
	 * @param previousState The previous state.
	 */
	watchStateChange?(newState: TState, previousState: TState): void;
}
