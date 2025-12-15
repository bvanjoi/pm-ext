import type { EditorView, NodeViewConstructor } from 'prosemirror-view'
import {
	setAddMetaForImageNodePlaceholder,
	setRemoveMetaForImageNodePlaceholder
} from '../plugins/placeholder'

function subscribePlaceholder(
	view: EditorView,
	getPos: () => number | undefined,
	imageDOM: HTMLImageElement
) {
	const id = Math.random().toString(36).substring(2, 15)
	const observer = new MutationObserver(mutations => {
		function findAddedImageElement(n: Node): boolean {
			if (n === imageDOM) {
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
						getPos()
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

	imageDOM.addEventListener('load', onLoad)
	return {
		unsubscribe: () => {
			observer.disconnect()
			imageDOM.removeEventListener('load', onLoad)
		}
	}
}

interface ImageNodeViewOptions {
	inline?: boolean
}

export function ImageNodeView(
	options?: ImageNodeViewOptions
): NodeViewConstructor {
	const { inline = false } = options ?? {}

	const ImageNodeViewConstructor: NodeViewConstructor = (
		node,
		view,
		getPos
	) => {
		const containerElement = inline ? 'span' : 'div'
		const imgContainer = document.createElement(containerElement)

		const img = document.createElement('img')
		img.src = node.attrs.src
		img.alt = node.attrs.alt
		img.title = node.attrs.title

		imgContainer.appendChild(img)

		const placeholderSubscription = subscribePlaceholder(view, getPos, img)

		return {
			dom: imgContainer,
			selectNode() {
				img.classList.add('ProseMirror-selectednode')
			},
			deselectNode() {
				img.classList.remove('ProseMirror-selectednode')
			},
			destroy() {
				placeholderSubscription.unsubscribe()
			}
		}
	}

	return ImageNodeViewConstructor
}
