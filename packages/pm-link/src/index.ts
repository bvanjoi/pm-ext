import type { Transaction } from 'prosemirror-state'
import type { LinkMarkSpec } from './types'
import {
	addHttpProtocolPrefix,
	ensureLinkMarkAttrs,
	getLinkMarkType,
	LINK_SPEC_SYMBOL,
} from './utils'

export { createAutoLinkParser } from './parseLink'
export { LINK_PLUGIN_SPEC } from './plugin'
export { getLinkMark } from './utils'

export const LINK_SPEC: LinkMarkSpec = {
	key: LINK_SPEC_SYMBOL,
	attrs: {
		href: {},
		originalHref: {},
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
				const href = dom.getAttribute('href')
				return {
					href,
					originalHref: href,
					auto: false,
				}
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
	const linkMark = linkMarkType.create({
		originalHref: href,
		href: addHttpProtocolPrefix(href),
	})
	ensureLinkMarkAttrs(linkMark)
	const textNode = schema.text(text, [linkMark])
	return tr.insert(pos, textNode)
}

export function addLinkMark(tr: Transaction, href: string): Transaction {
	const { schema } = tr.doc.type
	const linkMarkType = getLinkMarkType(schema)
	if (!linkMarkType) {
		return tr
	}
	const linkMark = linkMarkType.create({
		href: addHttpProtocolPrefix(href),
		originalHref: href,
	})
	ensureLinkMarkAttrs(linkMark)
	return tr.selection.ranges.reduce(
		(acc, range) => acc.addMark(range.$from.pos, range.$to.pos, linkMark),
		tr,
	)
}
