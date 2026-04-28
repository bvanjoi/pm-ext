import type { Node } from 'prosemirror-model'
import type { ImageAttrs, ImageNodeSpec } from './types'

interface ImageSpecOptions {
	key: symbol
	inline: boolean
	group: string
}

export function imageSpec(options: ImageSpecOptions): ImageNodeSpec {
	return {
		key: options.key,
		inline: options.inline,
		group: options.group,
		draggable: true,
		parseDOM: [
			{
				tag: 'img[src]',
				getAttrs: (node): ImageAttrs => {
					const src = node.getAttribute('src') || ''
					const alt = node.getAttribute('alt') || ''
					const title = node.getAttribute('title') || ''
					return { src, alt, title }
				}
			}
		],
		toDOM: (node: Node) => {
			return [
				'img',
				{ src: node.attrs.src, alt: node.attrs.alt, title: node.attrs.title }
			]
		},
		attrs: {
			src: {},
			alt: {
				default: ''
			},
			title: {
				default: ''
			},
			width: {
				default: undefined
			},
			height: {
				default: undefined
			}
		}
	}
}
