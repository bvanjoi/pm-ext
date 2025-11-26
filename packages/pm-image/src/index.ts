import { assertValue } from '@pm-ext/utils'
import type { Node, NodeSpec } from 'prosemirror-model'
import type { NodeViewConstructor } from 'prosemirror-view'

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

export const ImageNodeViewConstructor: NodeViewConstructor = (
	node,
	view,
	getPos,
	decorations,
) => {
	const img = document.createElement('img')
	img.src = node.attrs.src
	img.alt = node.attrs.alt
	img.title = node.attrs.title

	return {
		dom: img,
		selectNode() {
			img.classList.add('ProseMirror-selectednode')
		},
		deselectNode() {
			img.classList.remove('ProseMirror-selectednode')
		},
	}
}
