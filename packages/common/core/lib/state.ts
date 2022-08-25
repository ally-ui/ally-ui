import isEqual from 'lodash.isequal';
import type {UIOptions} from './ui';

export type Updater<TState> = ((oldState: TState) => TState) | TState;

export type ResolvedOptions<TOptions, TState> = TOptions & {
	/**
	 * Called by the core model when it **wants** to update state. It is up to
	 * the state implementation to respond to the state update request and
	 * trigger any side-effects e.g. updating the DOM.
	 */
	requestStateUpdate?: (updater: Updater<TState>) => void;
	/**
	 * Determines whether warnings and errors will be logged to console.
	 */
	debug?: boolean;
};

/**
 * A base construct for a stateful model that is decoupled from its state
 * implementation. This allows for bindings to a variety of state
 * implementations e.g. React `useState`, Svelte `writable`, and more.
 *
 * The model is initialized with a set of initial options. These options can be
 * reactively updated by the state implementation with `setOptions`.
 */
export abstract class StateModel<TOptions, TState> {
	id: string;

	initialState: TState;
	#previousState: TState;
	/**
	 * The current state of the model. This should be controlled by the state
	 * implementation.
	 */
	#state: TState;

	options: ResolvedOptions<TOptions, TState>;

	constructor(
		id: string,
		/**
		 * We receive the fully-resolved options during initialization to support
		 * additional configuration options.
		 */
		initialOptions: ResolvedOptions<TOptions, TState>,
	) {
		this.id = id;
		this.initialState = this.deriveInitialState(initialOptions);
		this.#previousState = this.initialState;
		this.#state = this.initialState;
		this.options = initialOptions;
	}

	abstract deriveInitialState(options: TOptions): TState;

	setOptions(updater: Updater<ResolvedOptions<TOptions, TState>>) {
		if (updater instanceof Function) {
			this.options = updater(this.options);
		} else {
			this.options = updater;
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
		if (!isEqual(newState, this.#previousState)) {
			this.watchStateChange?.(newState, this.#previousState);
		}
	}

	/**
	 * Watch for changes to state and trigger any effects in the core model.
	 * @param newState The new state.
	 * @param previousState The previous state.
	 */
	watchStateChange?(newState: TState, previousState: TState): void;

	uiOptions?: UIOptions;
	setUIOptions(uiOptions?: UIOptions) {
		this.uiOptions = uiOptions;
	}
}
