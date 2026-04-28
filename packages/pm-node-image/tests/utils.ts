import { docFromHtml, getWindow, pmState } from '@pm-ext/basic-setup'
import { INLINE_IMAGE_SPEC } from '@pm-ext/node-image'
import { assertValue } from '@pm-ext/utils'

interface Props {
	initHtml?: string
	pos?: number
	window?: { document: globalThis.Document }
}

export async function imageStateInNode(props: Omit<Props, 'window'> = {}) {
	return import('jsdom').then(d => {
		const jsDOM = new d.JSDOM()
		return imageState({
			...props,
			window: jsDOM.window
		})
	})
}

export function imageState(props: Props = {}) {
	const initHtml = props.initHtml
	return pmState({
		nodes: {
			inlineImage: INLINE_IMAGE_SPEC
			// blockImage: BLOCK_IMAGE_SPEC
		},
		doc: initHtml
			? schema => {
					const window = getWindow(props.window)
					const ret = docFromHtml(schema, initHtml, {
						window
					})
					assertValue(ret)
					return ret
				}
			: undefined,
		selection: props.pos
	})
}
