import { expect, test } from '@playwright/test'
import { AUTO_LINK_PLUGIN, AUTO_LINK_SPEC } from '@pm-ext/auto-link'
import { pmState } from '@pm-ext/basic-setup'
import { JSDOM } from 'jsdom'
import { DOMParser, type Node as PMNode, type Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

interface Props {
	initHtml?: string
	pos?: number
}

function state(props: Props = {}) {
	const initHtml = props.initHtml
	return pmState({
		marks: {
			link: AUTO_LINK_SPEC,
		},
		plugins: [new Plugin(AUTO_LINK_PLUGIN)],
		doc: initHtml
			? schema => {
					const dom = new JSDOM()
					const div = dom.window.document.createElement('div')
					div.innerHTML = initHtml
					return DOMParser.fromSchema(schema).parse(div)
				}
			: undefined,
		selection: props.pos,
	})
}

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

test('basic auto link', () => {
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
