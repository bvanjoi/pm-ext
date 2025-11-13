import type { AttributeSpec, MarkSpec } from 'prosemirror-model'
import type { EditorState, Transaction } from 'prosemirror-state'

export { createAutoLinkParser } from './parseLink'
export { AUTO_LINK_PLUGIN } from './plugin'

export type LinkSpecAttrs = {
	href: AttributeSpec
	auto: AttributeSpec
}

export type LinkMarkSpec = MarkSpec & {
	attrs: LinkSpecAttrs
}

export const LINK_SPEC: LinkMarkSpec = {
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

export function insertLink(
	state: EditorState,
	href: string,
	text: string,
): Transaction {
	const linkMark = state.schema.marks.link.create({ href })
	const textNode = state.schema.text(text, [linkMark])
	const tr = state.tr.replaceSelectionWith(textNode, false)
	return tr
}
