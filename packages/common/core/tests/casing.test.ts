import {kebabToCamelCase} from '../lib/main';

describe('kebab to camel case', () => {
	test('one word', () => {
		expect(kebabToCamelCase('apple')).toBe('apple');
	});

	test('no words', () => {
		expect(kebabToCamelCase('')).toBe('');
	});

	test('multiple words', () => {
		expect(kebabToCamelCase('apple-juice')).toBe('appleJuice');
		expect(kebabToCamelCase('iced-apple-juice')).toBe('icedAppleJuice');
	});
});
