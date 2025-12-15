import { pmViewFromState } from '@pm-ext/basic-setup'
import { setupEditorAction } from '@pm-ext/e2e-helper'
import { ImageNodeView } from '@pm-ext/node-image'
import { imageState } from '../utils'

function setupEditor() {
	const tempDom = document.createElement('div')
	tempDom.id = 'pm-editor'
	document.body.appendChild(tempDom)

	const state = imageState({
		initHtml: `<p>Here is an image: <img src="https://picsum.photos/200/300" alt="Example Image" /></p>`
	})
	const view = pmViewFromState(state, tempDom, {
		inlineImage: ImageNodeView({ inline: true })
	})

	setupEditorAction(view)
}

setupEditor()
