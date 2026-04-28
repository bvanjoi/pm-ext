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
	imageDom: HTMLImageElement,
	options?: ImagePlaceholderOptions
) => Subscription

export const subscribeInlinePlaceholder: SubscribeImagePlaceholder = (
	view,
	getPos,
	imageDom,
	options
) => {
	const { onLoad: customOnLoad } = options || {}
	const Radix = 36
	const Length = 15
	const id = Math.random().toString(Radix).substring(2, Length)
	const observer = new MutationObserver(mutations => {
		function findAddedImageElement(n: Node): boolean {
			if (n === imageDom) {
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

	imageDom.addEventListener('load', onLoad)
	return {
		unsubscribe: () => {
			observer.disconnect()
			imageDom.removeEventListener('load', onLoad)
		}
	}
}
