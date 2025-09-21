type Stats = 'EOF' | 'DISPOSE' | 'CONTINUE'

interface Sample {
	start?: number
	end: number
}

export interface LinkIndex {
	start: number
	end: number
}

class Record {
	r: Array<LinkIndex>
	constructor() {
		this.r = []
	}

	placeholder(start: number) {
		this.r.push({ start, end: -1 })
	}

	dispose() {
		this.r.pop()
	}

	record({ start, end }: Sample) {
		const index = this.r.length - 1
		if (!start) {
			this.r[index].end = end
		} else {
			this.r[index] = {
				start,
				end,
			}
		}
	}

	get result(): Array<LinkIndex> {
		return this.r
	}
}

/**
 * ```txt
 * url = <protocol>//<hostname>:<port><pathname>?<query>#<hash>
 * ```
 */
class Parser {
	protected index: number
	protected stats: Stats
	protected PROTOCOL_SET: Set<string>
	protected HOSTNAME_SUFFIX: string[]
	protected r: Record

	constructor(protected input: string) {
		this.index = 0
		this.stats = 'EOF'
		this.PROTOCOL_SET = new Set(['http:', 'https:'])
		this.HOSTNAME_SUFFIX = ['.com']
		this.r = new Record()
	}

	parse(): Array<LinkIndex> {
		while (this.index < this.input.length) {
			this.skipSpace()
			this.r.placeholder(this.index)
			this.readHostname()
			this.readPort()
			while (true) {
				if (this.stats === 'DISPOSE' || this.stats === 'EOF') {
					break
				}
				if (this.stats === 'CONTINUE') {
					this.readToken()
				}
			}
		}
		return this.r.result
	}

	protected skipSpace() {
		while (this.index < this.input.length) {
			if (this.input[this.index] === ' ') {
				this.index += 1
			} else {
				return
			}
		}
	}

	protected readToken() {
		if (this.index >= this.input.length) {
			this.finishToken('EOF')
			return
		}
		const char = this.input[this.index]
		if (char === '?') {
			this.skipQuestion()
			this.readQuery()
		} else if (char === '#') {
			this.skipHash()
			this.readHash()
		} else if (char === '/') {
			this.skipSlash()
			this.readPathname()
		} else {
			this.finishToken('EOF')
		}
	}

	protected skipProtocolSuffix() {
		// ://
		this.index += 3
	}

	protected skipColon() {
		this.index += 1
	}

	protected skipQuestion() {
		this.index += 1
	}

	protected skipHash() {
		this.index += 1
	}

	protected skipSlash() {
		this.index += 1
	}

	protected findPrevProtocol() {
		// `://`, pointed at `:`.
		if (this.input.slice(this.index - 5, this.index) === 'https') {
			this.finishToken('CONTINUE', { start: this.index - 5, end: -1 })
		} else if (this.input.slice(this.index - 4, this.index) === 'http') {
			this.finishToken('CONTINUE', { start: this.index - 4, end: -1 })
		} else {
			this.finishToken('DISPOSE', { end: this.index + 2 })
		}
	}

	protected readHostname() {
		let s = ''
		const validDotIndex: number[] = []
		while (this.index < this.input.length) {
			const char = this.input[this.index]
			if (
				char === ':' &&
				this.input[this.index + 1] === '/' &&
				this.input[this.index + 2] === '/'
			) {
				// maybe protocol;
				this.findPrevProtocol()
				this.skipProtocolSuffix()
				this.readHostname()
				return
			}
			if (
				char === '/' ||
				char === ':' ||
				char === '?' ||
				char === '#' ||
				char === ' '
			) {
				break
			}
			if (
				char === '.' &&
				s.length !== 0 &&
				this.isValidHostChar(s.charCodeAt(s.length - 1))
			) {
				validDotIndex.push(this.index)
				s += char
				this.index += 1
			} else if (this.isValidHostChar(char.charCodeAt(0))) {
				s += char
				this.index += 1
			} else {
				this.finishToken('DISPOSE', { end: this.index + 1 })
				return
			}
		}

		for (let i = validDotIndex.length - 1; i > -1; i -= 1) {
			const start = validDotIndex[i]
			for (const suffix of this.HOSTNAME_SUFFIX) {
				const len = suffix.length
				const end = start + len
				const slice = this.input.slice(start, end)
				const success = slice === suffix
				if (success) {
					this.finishToken('CONTINUE', { end })
					return
				}
			}
		}

		this.finishToken('DISPOSE', { end: this.index + 1 })
	}

	protected readPort() {
		// skip `:`
		const char = this.input[this.index]
		if (char !== ':') {
			return
		}

		// two ~ five digits
		// even as [01, 02, 001]
		this.index += 1
		let port = ''
		while (this.index < this.input.length) {
			const c = this.input[this.index]
			if (c >= '0' && c <= '9') {
				port += c
				this.index += 1
			} else {
				break
			}
		}

		if (port.length >= 2 && port.length <= 5) {
			this.finishToken('CONTINUE', { end: this.index })
		} else {
			this.finishToken('EOF')
		}
	}

	protected readPathname() {
		while (this.index < this.input.length) {
			const char = this.input[this.index]
			if (char === ' ' || char === '?' || char === '#') {
				break
			}
			if (this.isValidChar(char.charCodeAt(0))) {
				this.index += 1
			} else {
				break
			}
		}
		this.finishToken('CONTINUE', { end: this.index })
	}

	protected readQuery() {
		while (this.index < this.input.length) {
			const char = this.input[this.index]
			if (char === ' ' || char === '#') {
				break
			}
			if (this.isValidChar(char.charCodeAt(0))) {
				this.index += 1
			} else {
				break
			}
		}
		this.finishToken('CONTINUE', { end: this.index })
	}

	protected readHash() {
		while (this.index < this.input.length) {
			const char = this.input[this.index]
			if (char === ' ') {
				break
			}
			if (this.isValidChar(char.charCodeAt(0))) {
				this.index += 1
			} else {
				break
			}
		}
		this.finishToken('CONTINUE', { end: this.index })
	}

	protected isValidChar(char: number) {
		return char > 32 && char < 127
	}

	protected isValidHostChar(char: number) {
		return (
			(char >= 97 && char <= 122) || // a - z
			(char >= 65 && char <= 90) || // A - Z
			(char >= 48 && char <= 57)
		) // 0 - 9
	}

	protected finishToken(stats: Stats, sample?: Sample) {
		switch (stats) {
			case 'EOF':
				break
			case 'DISPOSE':
				if (!sample) {
					throw Error()
				}
				this.r.dispose()
				this.index = sample.end
				break
			case 'CONTINUE':
				if (!sample) {
					throw Error()
				}
				this.r.record(sample)
				break
		}
		this.stats = stats
	}
}

export type AutoLinkParser = (input: string) => Array<LinkIndex>

export function createAutoLinkParser(): AutoLinkParser {
	return input => {
		return new Parser(input).parse()
	}
}
