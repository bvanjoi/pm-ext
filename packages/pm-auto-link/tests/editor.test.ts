import { expect, test } from '@playwright/test'
import type { Node as PMNode, Schema } from 'prosemirror-model'
import { state } from './utils'

function asserts(value: unknown): asserts value {
	if (value == null || value === false) {
		throw Error
	}
}

function expectAutoLink(schema: Schema, node: PMNode, expectLink: string) {
	const linkMark = schema.marks.link
	const mark = node.marks.find(mark => mark.type === linkMark)
	asserts(mark)
	expect(mark.attrs.href).toBe(expectLink)
	expect(mark.attrs.isAuto).toBe(true)
}

test('auto link should works', () => {
	const s = state({
		initHtml: '<p>a.co</p>',
	})
	// <p>a.co</p>
	expect(s.doc.toString()).toBe('doc(p("a.co"))')
	{
		const tr = s.tr.insertText('m', 5)
		const s1 = s.apply(tr)
		// <p><a href="a.com">a.com</a></p>
		expect(s1.doc.toString()).toBe('doc(p(link("a.com")))')
		const n1 = s1.doc.nodeAt(1)
		asserts(n1)
		asserts(n1.marks.length === 1)
		expectAutoLink(s1.schema, n1, 'a.com')

		{
			const tr = s1.tr.delete(5, 6)
			const s2 = s1.apply(tr)
			// <p>a.co</p>
			expect(s2.doc.toString()).toBe('doc(p("a.co"))')
			const n2 = s2.doc.nodeAt(1)
			asserts(n2)
			expect(n2.marks.length).toBe(0)

			{
				// insert again
				const tr = s2.tr.insertText('m', 5)
				const s3 = s2.apply(tr)
				// <p><a href="a.com">a.com</a></p>
				expect(s3.doc.toString()).toBe('doc(p(link("a.com")))')
				const n1 = s3.doc.nodeAt(1)
				asserts(n1)
				asserts(n1.marks.length === 1)
				expectAutoLink(s3.schema, n1, 'a.com')
			}
		}
	}
})

test('auto link with whitespace', () => {
	const s = state({
		initHtml: '<p>a b.co</p>',
	})
	expect(s.doc.toString()).toBe('doc(p("a b.co"))')
	{
		const tr = s.tr.insertText('m', 7)
		const s1 = s.apply(tr)
		// <p>a <a href="b.com">b.com</a></p>
		expect(s1.doc.toString()).toBe('doc(p("a ", link("b.com")))')
		const n1 = s1.doc.nodeAt(3)
		asserts(n1)
		asserts(n1.marks.length === 1)
		expectAutoLink(s1.schema, n1, 'b.com')

		{
			const tr = s1.tr.delete(7, 8)
			const s2 = s1.apply(tr)
			// <p>a b.co</p>
			expect(s2.doc.toString()).toBe('doc(p("a b.co"))')
		}
	}
})
