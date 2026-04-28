import type { Transaction } from 'prosemirror-state'
import type { LinkMarkSpec, LinkMarkType } from './types'
import { addHttpProtocolPrefix, LINK_SPEC_SYMBOL } from './utils'

export { createAutoLinkParser } from './parseLink'
export { LINK_PLUGIN_SPEC } from './plugin'
export { getLinkMark, getLinkMarkType } from './utils'

export const LINK_SPEC: LinkMarkSpec = {
	key: LINK_SPEC_SYMBOL,
	attrs: {
		href: {},
		originalHref: {},
		auto: {
			default: false
		}
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
					auto: false
				}
			}
		}
	]
}

export function insertTextWithLinkMark(
	tr: Transaction,
	linkMarkType: LinkMarkType,
	pos: number,
	text: string,
	href: string = text
) {
	const linkMark = linkMarkType.create({
		originalHref: href,
		href: addHttpProtocolPrefix(href)
	})
	const textNode = tr.doc.type.schema.text(text, [linkMark])
	return tr.insert(pos, textNode)
}

export function addLinkMark(
	tr: Transaction,
	linkMarkType: LinkMarkType,
	href: string
): Transaction {
	const linkMark = linkMarkType.create({
		href: addHttpProtocolPrefix(href),
		originalHref: href
	})
	return tr.selection.ranges.reduce(
		(acc, range) => acc.addMark(range.$from.pos, range.$to.pos, linkMark),
		tr
	)
}

export function removeLinkMark(
	tr: Transaction,
	linkMarkType: LinkMarkType
): Transaction {
	return tr.selection.ranges.reduce(
		(acc, range) =>
			acc.removeMark(range.$from.pos, range.$to.pos, linkMarkType),
		tr
	)
}
