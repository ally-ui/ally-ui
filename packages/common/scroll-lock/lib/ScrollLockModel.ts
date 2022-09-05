import {StateModel} from '@ally-ui/core';

export interface ScrollLockOptions {
	active: boolean;
	onScrollCapture?: (ev: WheelEvent | TouchEvent) => void;
	onWheelCapture?: (ev: WheelEvent) => void;
	onTouchMoveCapture?: (ev: TouchEvent) => void;
}

export type ScrollLockState = ScrollLockOptions;

export class ScrollLockModel extends StateModel<ScrollLockState> {
	constructor(initialOptions: ScrollLockOptions) {
		super(initialOptions);
		if (this.state.active) {
			this.activate();
		}
	}

	watchStateChange({active}: ScrollLockState, prev: ScrollLockState) {
		if (active !== prev.active) {
			this.#onActiveChangeEffect(active);
		}
	}

	#onActiveChangeEffect(active: boolean) {
		if (active) {
			this.activate();
		} else {
			this.deactivate();
		}
	}

	activate() {}

	deactivate() {}
}
