import type { AttributeSpec, Mark, MarkSpec, MarkType } from 'prosemirror-model'
import type { Transaction } from 'prosemirror-state'
import { getLinkMarkType, LINK_SPEC_SYMBOL } from './utils'

export { createAutoLinkParser } from './parseLink'
export { AUTO_LINK_PLUGIN } from './plugin'

export type LinkSpecAttrs = {
	href: AttributeSpec
	auto: AttributeSpec
}

export type LinkMarkSpec = MarkSpec & {
	key: symbol
	attrs: LinkSpecAttrs
}

export type LinkMarkType = MarkType & {
	spec: LinkMarkSpec
}

export type LinkMark = Mark & {
	attrs: LinkSpecAttrs
}

export const LINK_SPEC: LinkMarkSpec = {
	key: LINK_SPEC_SYMBOL,
	attrs: {
		href: {},
		auto: {
			default: false,
		},
	},
	inclusive: false,
	toDOM: mark => ['a', { href: mark.attrs.href }, 0],
	parseDOM: [
		{
			tag: 'a[href]',
			getAttrs: dom => {
				return { href: dom.getAttribute('href') }
			},
		},
	],
}

export function insertTextWithLinkMark(
	tr: Transaction,
	pos: number,
	text: string,
	href: string = text,
) {
	const { schema } = tr.doc.type
	const linkMarkType = getLinkMarkType(schema)
	if (!linkMarkType) {
		return tr
	}
	const linkMark = linkMarkType.create({ href })
	const textNode = schema.text(text, [linkMark])
	return tr.insert(pos, textNode)
}

export function addLinkMark(tr: Transaction, href: string): Transaction {
	const { schema } = tr.doc.type
	const linkMarkType = getLinkMarkType(schema)
	if (!linkMarkType) {
		return tr
	}
	const linkMark = linkMarkType.create({ href })
	return tr.selection.ranges.reduce(
		(acc, range) => acc.addMark(range.$from.pos, range.$to.pos, linkMark),
		tr,
	)
}
