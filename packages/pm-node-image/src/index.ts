import type { Transaction } from 'prosemirror-state'
import type { NodeViewConstructor } from 'prosemirror-view'
import {
	setAddMetaForImageNodePlaceholder,
	setRemoveMetaForImageNodePlaceholder,
} from './plugins/placeholder'
import type { ImageNodeType } from './types'

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
		function findAddedImageElement(n: Node): boolean {
			if (n === img) {
				return true
			}
			if (n.hasChildNodes()) {
				for (const child of n.childNodes) {
					if (findAddedImageElement(child)) {
						return true
					}
				}
			}
			return false
		}

		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (findAddedImageElement(node)) {
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

	img.addEventListener('load', onLoad)

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
			img.removeEventListener('load', onLoad)
		},
	}
}

export function insertImageNodeAt(
	tr: Transaction,
	imageNodeType: ImageNodeType,
	pos: number,
	src: string,
) {
	const imageNode = imageNodeType.create({
		src,
	})
	return tr.insert(pos, imageNode)
}

export {
	getInlineImageNodeType,
	INLINE_IMAGE_SPEC,
	isInlineImageNodeType,
} from './inline'
export {
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC,
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY,
} from './plugins/placeholder'
