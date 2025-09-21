import { AUTO_LINK_PLUGIN, AUTO_LINK_SPEC } from '@pm-ext/auto-link'
import { pmState } from '@pm-ext/basic-setup'
import { JSDOM } from 'jsdom'
import { DOMParser } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'
import { test } from 'uvu'
import { equal } from 'uvu/assert'

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

test('basic auto link', () => {
	const s = state({
		initHtml: '<p>a.co</p>',
	})
	equal(s.doc.textContent, 'a.co')
	{
		const tr = s.tr.insertText('m', 5)
		const s1 = s.apply(tr)
		// <p><a href="a.com">a.com</a></p>
		equal(s1.doc.textContent, 'a.com')
		const n1 = s1.doc.nodeAt(1)
		asserts(n1)
		asserts(n1.marks.length === 1)
		const linkMark = n1.marks[0]
		equal(linkMark.attrs.href, 'a.com')
		equal(linkMark.attrs.isAuto, true)

		{
			const tr = s1.tr.delete(5, 6)
			const s2 = s1.apply(tr)
			// <p>a.co</p>
			equal(s2.doc.textContent, 'a.co')
			const n2 = s2.doc.nodeAt(1)
			asserts(n2)
			equal(n2.marks.length, 0)

			{
				// insert again
				const tr = s2.tr.insertText('m', 5)
				const s3 = s2.apply(tr)
				const n1 = s3.doc.nodeAt(1)
				asserts(n1)
				asserts(n1.marks.length === 1)
				const linkMark = n1.marks[0]
				equal(linkMark.attrs.href, 'a.com')
				equal(linkMark.attrs.isAuto, true)
			}
		}
	}
})

test.run()
