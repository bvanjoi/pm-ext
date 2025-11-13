export function assertValue(value: unknown): asserts value {
	if (!value) {
		throw new Error(`value is falsy: ${value}`)
	}
}

export function unreachable(): never {
	throw new Error('unreachable')
}
