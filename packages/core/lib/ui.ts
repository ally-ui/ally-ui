export interface UIOptions {
	waitForState?: () => Promise<void>;
	waitForDOM?: () => Promise<void>;
}
