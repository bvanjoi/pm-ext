import type { Node, NodeSpec } from 'prosemirror-model'

export const IMAGE_SPEC: NodeSpec = {
	toDOM: (node: Node) => [
		'img',
		{ src: node.attrs.src, alt: node.attrs.alt, title: node.attrs.title },
	],
	parseDOM: [
		{
			tag: 'img[src]',
			getAttrs: dom => {
				const src = dom.getAttribute('src')
				const alt = dom.getAttribute('alt')
				const title = dom.getAttribute('title')
				return {
					src,
					alt,
					title,
				}
			},
		},
	],
	attrs: {
		src: { default: '' },
		alt: { default: '' },
		title: { default: '' },
	},
	group: 'block',
	draggable: true,
}
