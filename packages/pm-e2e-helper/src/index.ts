import { pmView } from '@pm-ext/basic-setup'
import type { EditorView } from 'prosemirror-view'

export type Props = Omit<Parameters<typeof pmView>[0], 'container'>

function setupEditor(props: Props) {
	const tempDom = document.createElement('div')
	tempDom.id = 'pm-editor'
	document.body.appendChild(tempDom)

	const view = pmView({
		...props,
		container: tempDom,
	})

	window.editorAction = { view }
}

interface EditorAction {
	view: EditorView
}

declare global {
	interface Window {
		setupEditor: (props: Props) => void
		editorAction: EditorAction
	}
}

function mount() {
	window.setupEditor = setupEditor
}

mount()
