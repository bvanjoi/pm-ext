import { getMarkTypeBySpecKey } from '@pm-ext/pm-utils'
import { assertValue, isNil } from '@pm-ext/utils'
import type { Mark, MarkType, Node, Schema } from 'prosemirror-model'
import type { LinkMark, LinkMarkType } from './types'

export const LINK_SPEC_SYMBOL: symbol = Symbol('@pm-ext/linkSpec')

export function isLinkMark(mark: Mark): mark is LinkMark {
	return mark.type.spec.key === LINK_SPEC_SYMBOL
}

export function isLinkMarkType(markType: MarkType): markType is LinkMarkType {
	return markType.spec.key === LINK_SPEC_SYMBOL
}

export function getLinkMark(node: Node): LinkMark | undefined {
	const linkMarks = node.marks.filter(isLinkMark)
	assertValue(linkMarks.length <= 1)
	const linkMark = linkMarks[0]
	if (linkMark) {
		return linkMark
	}
}

export function getLinkMarkType(schema: Schema): MarkType | undefined {
	return getMarkTypeBySpecKey(schema.marks, 'link', LINK_SPEC_SYMBOL)
}

export function addHttpProtocolPrefix(href: string): string {
	if (href.startsWith('http://') || href.startsWith('https://')) {
		return href
	}
	return `https://${href}`
}

export function ensureLinkMarkAttrs(linkMark: Mark) {
	assertValue(!isNil(linkMark.attrs.originalHref))
	assertValue(!isNil(linkMark.attrs.href))
	assertValue(!isNil(linkMark.attrs.auto))
}
