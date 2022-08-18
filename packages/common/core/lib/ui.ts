export interface UIOptions {
	flushState?: () => Promise<void>;
	flushDOM?: () => Promise<void>;
}
