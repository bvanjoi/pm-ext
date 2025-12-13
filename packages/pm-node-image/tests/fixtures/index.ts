import { pmViewFromState } from '@pm-ext/basic-setup'
import { setupEditorAction } from '@pm-ext/e2e-helper'
import { ImageNodeViewConstructor } from '@pm-ext/node-image'
import { imageState } from '../utils'

function setupEditor() {
	const tempDom = document.createElement('div')
	tempDom.id = 'pm-editor'
	document.body.appendChild(tempDom)

	const state = imageState()
	const view = pmViewFromState(state, tempDom, {
		inlineImage: ImageNodeViewConstructor
	})

	setupEditorAction(view)
}

setupEditor()
