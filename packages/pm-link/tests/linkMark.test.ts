import { expect, test } from '@playwright/test'
import { addLinkMark, insertTextWithLinkMark } from '@pm-ext/link'
import { assertValue } from '@pm-ext/utils'
import type { Node as PMNode, Schema } from 'prosemirror-model'
import { TextSelection } from 'prosemirror-state'
import { state } from './utils'

function assertLink(
	schema: Schema,
	node: PMNode,
	expectLink: string,
	isAuto: boolean,
) {
	const linkMark = schema.marks.link
	const mark = node.marks.find(mark => mark.type === linkMark)
	assertValue(mark)
	expect(mark.attrs.href).toBe(expectLink)
	expect(mark.attrs.auto).toBe(isAuto)
}

function expectNoAutoLink(schema: Schema, node: PMNode, expectLink: string) {
	assertLink(schema, node, expectLink, false)
}

function expectAutoLink(schema: Schema, node: PMNode, expectLink: string) {
	assertLink(schema, node, expectLink, true)
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
	expectLinkText: string,
	expectLinkHref: string,
	isAuto: boolean,
) {
	expect(doc.toString()).toBe(`doc(p(link("${expectLinkText}")))`)
	const n1 = doc.nodeAt(1)
	assertValue(n1)
	expect(n1.marks.length).toBe(1)
	if (isAuto) {
		expectAutoLink(doc.type.schema, n1, expectLinkHref)
	} else {
		expectNoAutoLink(doc.type.schema, n1, expectLinkHref)
	}
}

test('auto link should works', () => {
	const s = state({
		initHtml: '<p>a.co</p>',
	})
	// <p>a.co</p>
	expectDocOnlyHasPlainText(s.doc, 'a.co')
	{
		const tr = s.tr.insertText('m', 5)
		const s1 = s.apply(tr)
		// <p><a href="a.com">a.com</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a.com', 'a.com', true)
		{
			const tr = s1.tr.delete(5, 6)
			const s2 = s1.apply(tr)
			// <p>a.co</p>
			expectDocOnlyHasPlainText(s2.doc, 'a.co')

			{
				// insert again
				const tr = s2.tr.insertText('m', 5)
				const s3 = s2.apply(tr)
				// <p><a href="a.com">a.com</a></p>
				expectDocOnlyHasLinkText(s3.doc, 'a.com', 'a.com', true)
			}
		}
	}
})

test('auto link with whitespace', () => {
	const s = state({
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
		expectAutoLink(s1.schema, n1, 'b.com')

		{
			const tr = s1.tr.delete(7, 8)
			const s2 = s1.apply(tr)
			// <p>a b.co</p>
			expectDocOnlyHasPlainText(s2.doc, 'a b.co')
		}
	}
})

test('insert text with link mark', () => {
	const s = state()
	expect(s.doc.toString()).toBe('doc(p)')
	{
		const tr = insertTextWithLinkMark(s.tr, 1, 'a', 'b')
		const s1 = s.apply(tr)
		// <p><a href="b">a</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a', 'b', false)
	}
	{
		const tr = insertTextWithLinkMark(s.tr, 1, 'a')
		const s1 = s.apply(tr)
		// <p><a href="a">a</a></p>
		expectDocOnlyHasLinkText(s1.doc, 'a', 'a', false)
	}
})

test('attach link mark to raw text', () => {
	const s = state({
		initHtml: '<p>t</p>',
	})
	expectDocOnlyHasPlainText(s.doc, 't')
	{
		const selection = TextSelection.create(s.doc, 1, 2)
		let tr = s.tr.setSelection(selection)
		tr = addLinkMark(tr, 'a')
		const s1 = s.apply(tr)
		// <p><a href="a">t</a></p>
		expectDocOnlyHasLinkText(s1.doc, 't', 'a', false)
	}
})

test('auto link should ignore normal link', () => {
	const s = state({
		initHtml: '<p>a</p>',
	})
	expectDocOnlyHasPlainText(s.doc, 'a')
	const selection = TextSelection.create(s.doc, 1, 2)
	const tr1 = s.tr.setSelection(selection)
	const s1 = s.apply(addLinkMark(tr1, 'a'))
	// <p><a href="a">a</a></p>
	expectDocOnlyHasLinkText(s1.doc, 'a', 'a', false)

	const tr2 = s1.tr.insertText('.com', 2)
	const s2 = s1.apply(tr2)
	// <p><a href="a">a</a>.com</p>
	expect(s2.doc.toString()).toBe('doc(p(link("a"), ".com"))')
})
