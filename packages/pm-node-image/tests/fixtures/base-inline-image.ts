import { pmViewFromState } from '@pm-ext/basic-setup'
import { setupEditorAction } from '@pm-ext/e2e-helper'
import { ImageNodeView } from '@pm-ext/node-image'
import {
	type ImagePlaceholderOptions,
	subscribeInlinePlaceholder
} from '@pm-ext/node-image/view/default-placeholder'
import { imageState } from '../utils'

interface Options {
	builtinInlineImagePlaceholderOptions?: ImagePlaceholderOptions
}

export function setupInlineImageEditor(options?: Options) {
	const tempDom = document.createElement('div')
	tempDom.id = 'pm-editor'
	document.body.appendChild(tempDom)

	const state = imageState({
		initHtml: `<p>Here is an image: <img src="https://picsum.photos/200/300" alt="Example Image" /></p>`
	})
	const view = pmViewFromState(state, tempDom, {
		inlineImage: ImageNodeView({
			inline: true,
			subscribePlaceholder: (view, getPos, dom) =>
				subscribeInlinePlaceholder(
					view,
					getPos,
					dom,
					options?.builtinInlineImagePlaceholderOptions
				)
		})
	})

	setupEditorAction(view)
}
