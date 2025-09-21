import { createAutoLinkParser } from '@pm-ext/auto-link'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

test('autoLinkParse', () => {
	const p = createAutoLinkParser()

	function equalEmptyLink(input: string) {
		equal(p(input), [])
	}

	function equalSingleLink(input: string, start: number, end: number) {
		const res = p(input)
		equal(res.length, 1)
		equal(res[0].start, start)
		equal(res[0].end, end)
	}

	function equalMultipleLink(
		input: string,
		links: { start: number; end: number }[],
	) {
		equal(p(input), links)
	}

	equalEmptyLink('.com')
	equalEmptyLink('..com')
	equalEmptyLink('a..com')
	equalEmptyLink('a.co')
	equalSingleLink('.a.com', 1, 6)
	equalSingleLink('.com.com.com', 1, 12)
	equalSingleLink('a.com.co', 0, 5)
	equalSingleLink('a.com.com', 0, 9)
	equalSingleLink('a.com:8', 0, 5)
	equalSingleLink('a.com:80', 0, 8)
	equalSingleLink('a.com:80:80', 0, 8)
	equalSingleLink('a.com:80a', 0, 8)
	equalMultipleLink('a.com:80a.com', [
		{ start: 0, end: 8 },
		{ start: 8, end: 13 },
	])
	equalMultipleLink('a.com 80a.com', [
		{ start: 0, end: 5 },
		{ start: 6, end: 13 },
	])
	equalEmptyLink('http://')
	equalEmptyLink('http://.com')
	equalSingleLink('http:/a.com', 6, 11)
	equalSingleLink('http://a.com', 0, 12)
	equalSingleLink('abchttp://a.com', 3, 15)
	equalSingleLink('http:///a.com', 8, 13)
	equalSingleLink('a.com?a', 0, 7)
	equalSingleLink('a.com#a', 0, 7)
	equalSingleLink('a.com?a#b', 0, 9)
	equalSingleLink('a.com#a?b', 0, 9)
	equalSingleLink('a.com#a啊?b', 0, 7)
	equalSingleLink('a.com/b/c?d#e!f', 0, 15)
})

test.run()
