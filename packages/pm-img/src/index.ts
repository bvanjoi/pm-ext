import type { NodeSpec } from 'prosemirror-model'

export const IMG_NODE_SPEC: NodeSpec = {
	toDOM: () => ['img', {}],
	attrs: {
		src: { default: '' },
		alt: { default: '' },
		title: { default: '' },
	},
	group: 'block',
	draggable: true,
}
