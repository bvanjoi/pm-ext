import type { AttributeSpec, MarkSpec } from 'prosemirror-model'

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
