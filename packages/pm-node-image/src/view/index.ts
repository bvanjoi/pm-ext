import type { Node } from 'prosemirror-model'
import type { EditorView, NodeViewConstructor } from 'prosemirror-view'
import { subscribeWidthHeight } from './subscribe-width-height'

type Subscribe = (
	view: EditorView,
	getPos: () => number | undefined,
	imageDom: HTMLImageElement
) => Subscription

interface Subscription {
	unsubscribe: () => void
}

interface ImageNodeViewOptions {
	inline?: boolean
	subscribePlaceholder?: Subscribe
}

function ImageNodeViewConstructor(
	node: Node,
	view: EditorView,
	getPos: () => number | undefined,
	options?: ImageNodeViewOptions
) {
	const { inline = false, subscribePlaceholder } = options ?? {}
	const containerElement = inline ? 'span' : 'div'
	const imgContainer = document.createElement(containerElement)

	const img = document.createElement('img')
	img.src = node.attrs.src
	img.alt = node.attrs.alt
	img.title = node.attrs.title

	imgContainer.appendChild(img)

	const placeholderSubscription = subscribePlaceholder?.(view, getPos, img)
	const widthHeightSubscription = subscribeWidthHeight(view, getPos, img, node)

	return {
		dom: imgContainer,
		selectNode() {
			img.classList.add('ProseMirror-selectednode')
		},
		deselectNode() {
			img.classList.remove('ProseMirror-selectednode')
		},
		destroy() {
			placeholderSubscription?.unsubscribe()
			widthHeightSubscription.unsubscribe()
		}
	}
}

export function ImageNodeView(
	options?: ImageNodeViewOptions
): NodeViewConstructor {
	return (node, view, getPos) =>
		ImageNodeViewConstructor(node, view, getPos, options)
}

export type { Subscribe, Subscription }
