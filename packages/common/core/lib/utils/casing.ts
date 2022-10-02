export function titleCaseWord(word: string): string {
	if (word.length <= 1) return word.toUpperCase();
	return word.at(0)!.toUpperCase() + word.slice(1);
}

export function kebabToCamelCase<TString extends string>(
	str: TString,
): KebabToCamelCase<TString> {
	const [first, ...rest] = str.split('-');
	return [first, ...rest.map((word) => titleCaseWord(word))].join(
		'',
	) as KebabToCamelCase<TString>;
}

export type KebabToCamelCase<TString> = TString extends `${infer T}-${infer U}`
	? `${T}${Capitalize<KebabToCamelCase<U>>}`
	: TString;

export type KebabToCamelCaseObject<TObject extends object> = {
	[TKey in keyof TObject as KebabToCamelCase<TKey>]: TObject[TKey];
};

export function kebabToCamelCaseObject<TObject extends object>(
	obj?: TObject | null,
): KebabToCamelCaseObject<TObject> | null | undefined {
	if (obj == null) return obj;
	const result: Record<string, unknown> = {};
	Object.entries(obj).forEach(([key, value]) => {
		result[kebabToCamelCase(key)] = value;
	});
	return result as KebabToCamelCaseObject<TObject>;
}
