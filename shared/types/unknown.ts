export type Except<Type, ExceptType, ErrorMessage = never> =
	Type extends ExceptType ? ErrorMessage : Type;

export function isObject(object: unknown): object is object {
	return typeof object === 'object' && object !== null;
}

type PossibleTypes = {
	undefined: undefined;
	null: null;
	object: object;
	boolean: boolean;
	number: number;
	bigint: bigint;
	string: string;
	symbol: symbol;
	function: (...args: unknown[]) => unknown;
};

type TypeOfUnion<T extends readonly (keyof PossibleTypes)[]> =
	PossibleTypes[T[number]];

/**
 * Checks whether an unknown value is a non-null object and contains a property
 * with the specified key and runtime type.
 *
 * Acts as a type guard that refines the input to an object with the given key
 * and value type, based on the result of `typeof`.
 *
 * @param object The value to validate.
 * @param key The property key to check for.
 * @param expectedValueType The expected type of the property's value (as returned by `typeof`). 'null' can also be used.
 * @example <caption>Example usage of validating an object expected to an id property of type number.</caption>
 * unknownHasProperty(request.body, 'id', 'number');
 * @returns `true` if the value is an object, contains the key, and the property value matches the expected type; otherwise, `false`.
 */
export function unknownHasProperty<
	KeyType extends string | number | symbol,
	ValueType extends keyof PossibleTypes,
>(
	object: unknown,
	key: KeyType,
	expectedValueType: ValueType,
): object is Record<KeyType, PossibleTypes[ValueType]>;
/**
 * Checks whether an unknown value is a non-null object and contains a property
 * with the specified key and runtime types.
 *
 * Acts as a type guard that refines the input to an object with the given key
 * and value type, based on the result of `typeof`.
 *
 * @param object The value to validate.
 * @param key The property key to check for.
 * @param expectedValueTypes The expected types of the property's value (as returned by `typeof`), as an array. 'null' can also be used.
 * @example <caption>Example usage of validating an object expected to an id property of type number or undefined.</caption>
 * unknownHasProperty(request.body, 'id', ['number', 'undefined']);
 * @returns `true` if the value is an object, contains the key, and the property value matches the expected type; otherwise, `false`.
 */
export function unknownHasProperty<
	KeyType extends string | number | symbol,
	ValueTypes extends (keyof PossibleTypes)[],
>(
	object: unknown,
	key: KeyType,
	expectedValueTypes: ValueTypes,
): object is Record<KeyType, TypeOfUnion<ValueTypes>>;
export function unknownHasProperty(
	object: unknown,
	key: KeyType,
	expectedValueTypes: string | string[],
): boolean {
	const types =
		Array.isArray(expectedValueTypes) ? expectedValueTypes : (
			[expectedValueTypes]
		);

	if (!isObject(object) || !(key in object)) {
		return false;
	}

	const value = (object as Record<KeyType, unknown>)[key];

	return types.some((expected) => {
		if (expected === 'null') {
			return value === null;
		}
		return typeof value === expected;
	});
}

/**
 * Checks whether an unknown value is a non-null object and contains all specified
 * properties with their expected runtime types.
 *
 * Acts as a type guard that refines the input to an object with a known set of keys,
 * each having the type specified in the mapping (based on `typeof` checks).
 *
 * @param object The value to validate.
 * @param keyTypeMapping An object whose keys are the required property names, and whose values are the expected types (e.g., `'string'`, `'number'`).
 * @example <caption>Multiple usage examples.</caption>
 * // Validate a value expected to have two strings
 * unknownHasProperties(request.body, {state: 'string', mode: 'string'});
 * // Validate an object expected to have a number, a string, and a boolean
 * unknownHasProperties(request.body, {id: 'number', state: 'string', success: 'boolean'});
 * @returns `true` if the value is an object, contains all specified keys, and their values match the expected types; otherwise, `false`.
 */
export function unknownHasProperties<
	Mapping extends Record<string, keyof PossibleTypes>,
>(
	object: unknown,
	keyTypeMapping: Mapping,
): object is { [KeyType in keyof Mapping]: PossibleTypes[Mapping[KeyType]] } {
	for (const [key, valueType] of Object.entries(keyTypeMapping)) {
		if (!unknownHasProperty(object, key, valueType)) {
			return false;
		}
	}

	return true;
}
