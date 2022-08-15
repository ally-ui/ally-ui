import isEqual from 'lodash.isequal';
import {UIOptions} from './types';

export type Updater<TState> = ((oldState: TState) => TState) | TState;

export type ResolvedOptions<TOptions, TState> = TOptions & {
	/**
	 * The current state of the model. This should be controlled by the state
	 * implementation.
	 */
	state: TState;
	/**
	 * Called by the core model when it **wants** to update state. It is up to
	 * the state implementation to respond to the state update request and
	 * trigger any side-effects e.g. updating the DOM.
	 */
	onStateChange?: (updater: Updater<TState>) => void;
};

/**
 * A base construct for a stateful model that is decoupled from its state
 * implementation. This allows for bindings to a variety of state
 * implementations e.g. React `useState`, Svelte `writable`, and more.
 *
 * The model is initialized with a set of initial options. These options can be
 * reactively updated by the state implementation with `setOptions`.
 *
 * State will always be updated when options are updated via `deriveState`.
 */
export abstract class StatefulModel<TOptions, TState> {
	initialState: TState;
	#previousState: TState;
	options: ResolvedOptions<TOptions, TState>;

	constructor(initialOptions: TOptions) {
		this.initialState = this.deriveInitialState(initialOptions);
		this.#previousState = this.initialState;
		this.options = {
			state: this.initialState,
			...initialOptions,
		};
	}

	abstract deriveInitialState(options: TOptions): TState;

	setOptions(updater: Updater<ResolvedOptions<TOptions, TState>>) {
		if (updater instanceof Function) {
			this.options = updater(this.options);
		} else {
			this.options = updater;
		}
		if (!isEqual(this.options.state, this.#previousState)) {
			this.watchStateChange?.(this.options.state, this.#previousState);
		}
		this.#previousState = this.options.state;
	}

	/**
	 * Watch for changes to state and trigger any effects in the core model.
	 * @param newState The new state
	 * @param oldState The previous state
	 */
	watchStateChange?(newState: TState, oldState: TState): void;

	uiOptions?: UIOptions;
	setUIOptions(uiOptions: UIOptions) {
		this.uiOptions = uiOptions;
	}
}
