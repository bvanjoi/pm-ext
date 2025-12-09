import { expect, test } from '@playwright/test'
import {
	addLinkMark,
	getLinkMarkType,
	insertTextWithLinkMark,
	removeLinkMark,
} from '@pm-ext/mark-link'
import { assertValue } from '@pm-ext/utils'
import type { Node as PMNode, Schema } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { linkState } from './utils'

interface ExpectedLinkMarkAttrs {
	href: string
	originalHref: string
	isAuto: boolean
}

function assertLink(
	schema: Schema,
	node: PMNode,
	attrs: ExpectedLinkMarkAttrs,
) {
	const linkMark = schema.marks.link
	const mark = node.marks.find(mark => mark.type === linkMark)
	assertValue(mark)
	expect(mark.attrs.href).toBe(attrs.href)
	expect(mark.attrs.auto).toBe(attrs.isAuto)
	expect(mark.attrs.originalHref).toBe(attrs.originalHref)
}

function expectDocOnlyHasPlainText(doc: PMNode, expectText?: string) {
	if (expectText === undefined) {
		expect(doc.toString()).toBe('doc(p)')
	} else {
		expect(doc.toString()).toBe(`doc(p("${expectText}"))`)
	}
	const n1 = doc.nodeAt(1)
	assertValue(n1)
	expect(n1.marks.length).toBe(0)
}

function expectDocOnlyHasLinkText(
	doc: PMNode,
	expectedLinkText: string,
	expectedLinkAttrs: ExpectedLinkMarkAttrs,
) {
	expect(doc.toString()).toBe(`doc(p(link("${expectedLinkText}")))`)
	const n1 = doc.nodeAt(1)
	assertValue(n1)
	expect(n1.marks.length).toBe(1)
	assertLink(doc.type.schema, n1, expectedLinkAttrs)
}

test('auto link should works', () => {
	const s = linkState({
		initHtml: '<p>a.co</p>',
	})
	const linkMarkType = getLinkMarkType(s.schema, 'link')
	assertValue(linkMarkType)
	// <p>a.co</p>
	expectDocOnlyHasPlainText(s.doc, 'a.co')
	{
		const s1 = s.apply(s.tr.insertText('m', 5))
		// <p><a href="https://a.com">a.com</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a.com', {
			href: 'https://a.com',
			originalHref: 'a.com',
			isAuto: true,
		})
		{
			const s2 = s1.apply(s1.tr.delete(5, 6))
			// <p>a.co</p>
			expectDocOnlyHasPlainText(s2.doc, 'a.co')

			// insert again
			const s3 = s2.apply(s2.tr.insertText('m', 5))
			// <p><a href="a.com">a.com</a></p>
			expectDocOnlyHasLinkText(s3.doc, 'a.com', {
				href: 'https://a.com',
				originalHref: 'a.com',
				isAuto: true,
			})
		}

		{
			const selection = TextSelection.create(s1.doc, 1, 6)
			const tr = removeLinkMark(s1.tr.setSelection(selection), linkMarkType)
			const s2 = s1.apply(tr)
			// <p>a.com</p>
			expectDocOnlyHasPlainText(s2.doc, 'a.com')
		}
	}

	{
		const s1 = s.apply(s.tr.insertText('https://', 1))
		expectDocOnlyHasPlainText(s1.doc, 'https://a.co')
		const s2 = s1.apply(s1.tr.insertText('m', 13))
		expectDocOnlyHasLinkText(s2.doc, 'https://a.com', {
			href: 'https://a.com',
			originalHref: 'https://a.com',
			isAuto: true,
		})
	}
})

test('auto link with whitespace', () => {
	const s = linkState({
		initHtml: '<p>a b.co</p>',
	})
	expectDocOnlyHasPlainText(s.doc, 'a b.co')
	{
		const tr = s.tr.insertText('m', 7)
		const s1 = s.apply(tr)
		// <p>a <a href="b.com">b.com</a></p>
		expect(s1.doc.toString()).toBe('doc(p("a ", link("b.com")))')
		const n1 = s1.doc.nodeAt(3)
		assertValue(n1)
		assertValue(n1.marks.length === 1)
		assertLink(s1.schema, n1, {
			href: 'https://b.com',
			originalHref: 'b.com',
			isAuto: true,
		})

		const s2 = s1.apply(s1.tr.delete(7, 8))
		// <p>a b.co</p>
		expectDocOnlyHasPlainText(s2.doc, 'a b.co')
	}
})

test('insert text with link mark', () => {
	const s = linkState()
	expect(s.doc.toString()).toBe('doc(p)')
	const linkMarkType = getLinkMarkType(s.schema, 'link')
	assertValue(linkMarkType)
	{
		const tr = insertTextWithLinkMark(s.tr, linkMarkType, 1, 'a', 'b')
		const s1 = s.apply(tr)
		// <p><a href="https://b">a</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a', {
			href: 'https://b',
			originalHref: 'b',
			isAuto: false,
		})
	}
	{
		const tr = insertTextWithLinkMark(s.tr, linkMarkType, 1, 'a')
		const s1 = s.apply(tr)
		// <p><a href="https://a">a</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a', {
			href: 'https://a',
			originalHref: 'a',
			isAuto: false,
		})
	}
})

test('attach link mark to raw text', () => {
	const s = linkState({
		initHtml: '<p>t</p>',
	})
	const linkMarkType = getLinkMarkType(s.schema, 'link')
	assertValue(linkMarkType)
	expectDocOnlyHasPlainText(s.doc, 't')
	const selection = TextSelection.create(s.doc, 1, 2)
	let tr = s.tr.setSelection(selection)
	tr = addLinkMark(tr, linkMarkType, 'a')
	const s1 = s.apply(tr)
	// <p><a href="https://a">t</a></p>
	expectDocOnlyHasLinkText(s1.doc, 't', {
		href: 'https://a',
		originalHref: 'a',
		isAuto: false,
	})
})

test('auto link should ignore normal link', () => {
	const s = linkState({
		initHtml: '<p>a</p>',
	})
	const linkMarkType = getLinkMarkType(s.schema, 'link')
	assertValue(linkMarkType)
	expectDocOnlyHasPlainText(s.doc, 'a')
	const selection = TextSelection.create(s.doc, 1, 2)
	const tr1 = s.tr.setSelection(selection)
	const s1 = s.apply(addLinkMark(tr1, linkMarkType, 'a'))
	// <p><a href="https://a">a</a></p>
	expectDocOnlyHasLinkText(s1.doc, 'a', {
		href: 'https://a',
		originalHref: 'a',
		isAuto: false,
	})

	const tr2 = s1.tr.insertText('.com', 2)
	const s2 = s1.apply(tr2)
	// <p><a href="https://a">a</a>.com</p>
	expect(s2.doc.toString()).toBe('doc(p(link("a"), ".com"))')
})
