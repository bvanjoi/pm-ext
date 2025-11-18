import type { Mark, MarkType, Schema } from 'prosemirror-model'
import type { LinkMark, LinkMarkType } from './index'

export const LINK_SPEC_SYMBOL: symbol = Symbol('@pm-ext/linkSpec')

export function isLinkMark(mark: Mark): mark is LinkMark {
	return mark.type.spec.key === LINK_SPEC_SYMBOL
}

export function isLinkMarkType(markType: MarkType): markType is LinkMarkType {
	return markType.spec.key === LINK_SPEC_SYMBOL
}

export function getLinkMarkType(schema: Schema): MarkType | undefined {
	return getMarkType(schema, LINK_SPEC_SYMBOL)
}

export function getMarkType(schema: Schema, key: symbol): MarkType | undefined {
	const { link } = schema.marks
	if (link && link.spec.key === key) {
		return link
	}
}
