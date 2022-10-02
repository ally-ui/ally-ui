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

export type KebabToCamelCase<TString extends string> =
	TString extends `${infer T}-${infer U}`
		? `${T}${Capitalize<KebabToCamelCase<U>>}`
		: TString;
