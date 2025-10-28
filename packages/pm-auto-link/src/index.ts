import type { MarkSpec } from 'prosemirror-model'

export { createAutoLinkParser } from './parseLink'
export { AUTO_LINK_PLUGIN } from './plugin'

export const AUTO_LINK_SPEC: MarkSpec = {
	attrs: {
		href: {},
		isAuto: {
			default: true,
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
