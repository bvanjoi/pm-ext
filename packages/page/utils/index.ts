import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function assertValue(value: unknown): asserts value {
	if (!value) {
		throw new Error(`value is falsy: ${value}`)
	}
}

export function unreachable(): never {
	throw new Error('unreachable')
}
