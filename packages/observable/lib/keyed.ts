import {type TWritable, WritableImpl} from './core';
import type {Get} from 'type-fest';
import {Updater} from './main';

export const getTokens = (key: string): string[] => {
	let keyWithoutBracket = key.replace(/\[(\d+)\]/g, '.$1');
	if (keyWithoutBracket.startsWith('.')) {
		keyWithoutBracket = keyWithoutBracket.slice(1);
	}
	return keyWithoutBracket.split('.');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getNested = (root: unknown, keyTokens: string[]): any => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let current: any = root;
	for (const key of keyTokens) {
		if (current == null) {
			return undefined;
		}
		current = current[key];
	}
	return current;
};

const clonedWithPrototype = <T extends object>(source: T): T => {
	const clone = Object.create(source);
	Object.assign(clone, source);
	return clone;
};

class KeyedImpl<
	TParent extends object,
	TPath extends string,
> extends WritableImpl<Get<TParent, TPath>> {
	#parent: TWritable<TParent>;
	#keyTokens: string[];
	#branchTokens: string[];
	#leafToken: string;

	constructor(
		parent: TWritable<TParent | undefined | null>,
		path: TPath | KeyPath<TParent>,
	);
	constructor(
		parent: TWritable<TParent | undefined | null>,
		path: TPath | KeyPath<TParent>,
	);
	constructor(parent: TWritable<TParent>, path: TPath | KeyPath<TParent>) {
		const keyTokens = getTokens(path);
		super(undefined, (set) => {
			return parent.subscribe(($parent) => {
				if (keyTokens.some((token) => token === '__proto__')) {
					throw new Error('key cannot include "__proto__"');
				}
				set(getNested($parent, keyTokens));
			});
		});
		this.#parent = parent;
		this.#keyTokens = keyTokens;
		this.#branchTokens = keyTokens.slice(0, keyTokens.length - 1);
		this.#leafToken = keyTokens[keyTokens.length - 1];
	}

	update(updater: Updater<Get<TParent, TPath>>) {
		this.#parent.update(($parent) => {
			if ($parent == null) {
				return $parent;
			}
			const newValue = updater(getNested($parent, this.#keyTokens));
			const newParent = Array.isArray($parent)
				? [...$parent]
				: clonedWithPrototype($parent);
			getNested(newParent, this.#branchTokens)[this.#leafToken] = newValue;
			return newParent as TParent;
		});
	}

	set(newValue: Get<TParent, TPath>) {
		this.#parent.update(($parent) => {
			if ($parent == null) {
				return $parent;
			}
			const newParent = Array.isArray($parent)
				? [...$parent]
				: clonedWithPrototype($parent);
			getNested(newParent, this.#branchTokens)[this.#leafToken] = newValue;
			return newParent as TParent;
		});
	}
}

export function keyed<TParent extends object, TPath extends string>(
	parent: TWritable<TParent>,
	path: TPath | KeyPath<TParent>,
): TWritable<Get<TParent, TPath>>;

export function keyed<TParent extends object, TPath extends string>(
	parent: TWritable<TParent | undefined | null>,
	path: TPath | KeyPath<TParent>,
): TWritable<Get<TParent, TPath> | undefined>;

export function keyed<TParent extends object, TPath extends string>(
	parent: TWritable<TParent | undefined | null>,
	path: TPath | KeyPath<TParent>,
): TWritable<Get<TParent, TPath>> {
	return new KeyedImpl<TParent, TPath>(parent, path);
}

type KeyPath<T, D extends number = 3> = KeyPath_<T, D, []>;

type KeyPath_<T, D extends number, S extends unknown[]> = D extends S['length']
	? never
	: T extends object
	? {
			[K in keyof T]-?: K extends string
				? `${K}` | Join<K, KeyPath_<T[K], D, [never, ...S]>>
				: K extends number
				? `[${K}]` | Join<`[${K}]`, KeyPath_<T[K], D, [never, ...S]>>
				: never;
	  }[keyof T]
	: '';

type Join<K, P> = K extends string | number
	? P extends string | number
		? P extends `[${string}`
			? `${K}${P}`
			: `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never;
