import type { Node, NodeSpec } from 'prosemirror-model'
import type { NodeViewConstructor } from 'prosemirror-view'
import {
	setAddMetaForImageNodePlaceholder,
	setRemoveMetaForImageNodePlaceholder,
} from './plugin'

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
) => {
	const img = document.createElement('img')
	img.src = node.attrs.src
	img.alt = node.attrs.alt
	img.title = node.attrs.title

	const id = crypto.randomUUID()

	const observer = new MutationObserver(mutations => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node === img) {
					const tr = setAddMetaForImageNodePlaceholder(
						view.state.tr,
						id,
						getPos(),
					)
					view.dispatch(tr)
					return
				}
			}
		}
	})

	observer.observe(view.dom, { childList: true, subtree: true })

	function onLoad() {
		const tr = setRemoveMetaForImageNodePlaceholder(view.state.tr, id)
		view.dispatch(tr)
	}

	window.addEventListener('load', onLoad)

	return {
		dom: img,
		selectNode() {
			img.classList.add('ProseMirror-selectednode')
		},
		deselectNode() {
			img.classList.remove('ProseMirror-selectednode')
		},
		destroy() {
			observer.disconnect()
			window.removeEventListener('load', onLoad)
		},
	}
}

export {
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC,
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY,
} from './plugin'
