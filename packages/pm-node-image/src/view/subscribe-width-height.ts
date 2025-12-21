import { assertValue } from '@pm-ext/utils'
import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'
import type { Subscription } from '.'

function defaultOnLoad(
	view: EditorView,
	getPos: () => number | undefined,
	imageDOM: HTMLImageElement,
	node: Node
) {
	const pos = getPos()
	if (pos === undefined) {
		return
	}
	assertValue(node.attrs.width !== 0)
	assertValue(node.attrs.height !== 0)
	assertValue(imageDOM.width)
	assertValue(imageDOM.height)
	const tr = view.state.tr
		.setNodeAttribute(pos, 'width', imageDOM.width)
		.setNodeAttribute(pos, 'height', imageDOM.height)
	view.dispatch(tr)
}

export function subscribeWidthHeight(
	view: EditorView,
	getPos: () => number | undefined,
	imageDOM: HTMLImageElement,
	node: Node
): Subscription {
	const onload = () => defaultOnLoad(view, getPos, imageDOM, node)
	imageDOM.addEventListener('load', onload)

	return {
		unsubscribe() {
			imageDOM.removeEventListener('load', onload)
		}
	}
}
