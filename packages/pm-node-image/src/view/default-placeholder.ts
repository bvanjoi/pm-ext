import type { EditorView } from 'prosemirror-view'
import type { Subscription } from '..'
import {
	setAddMetaForImageNodePlaceholder,
	setRemoveMetaForImageNodePlaceholder
} from '../plugins/placeholder'

export interface ImagePlaceholderOptions {
	onLoad?: (view: EditorView, id: string) => void
}

export function defaultOnLoad(view: EditorView, id: string) {
	const tr = setRemoveMetaForImageNodePlaceholder(view.state.tr, id)
	view.dispatch(tr)
}

export type SubscribeImagePlaceholder = (
	view: EditorView,
	getPos: () => number | undefined,
	imageDOM: HTMLImageElement,
	options?: ImagePlaceholderOptions
) => Subscription

export const subscribeInlinePlaceholder: SubscribeImagePlaceholder = (
	view,
	getPos,
	imageDOM,
	options
) => {
	const { onLoad: customOnLoad } = options || {}
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

	const onLoad = () => {
		const callback = customOnLoad || defaultOnLoad
		callback(view, id)
	}

	imageDOM.addEventListener('load', onLoad)
	return {
		unsubscribe: () => {
			observer.disconnect()
			imageDOM.removeEventListener('load', onLoad)
		}
	}
}
