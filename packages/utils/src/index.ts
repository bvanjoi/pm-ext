export function assertValue(value: unknown): asserts value {
	if (!value) {
		throw new Error(`value is falsy: ${value}`)
	}
}

export function unreachable(): never {
	throw new Error('unreachable')
}

export function isNil(value: unknown): value is null | undefined {
	return value === null || value === undefined
}
