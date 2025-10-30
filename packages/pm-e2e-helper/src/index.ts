import { type pmState, pmView } from '@pm-ext/basic-setup'
import type { EditorView } from 'prosemirror-view'

type Props = Parameters<typeof pmState>[0]

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

export function mount() {
	window.setupEditor = setupEditor
}

mount()
