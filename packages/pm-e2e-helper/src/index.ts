import type { EditorView } from 'prosemirror-view'

interface EditorAction {
	focusEditor(): void
}

export function setupEditorAction(view: EditorView) {
	window.editorAction = {
		focusEditor() {
			view.focus()
		}
	}
}

declare global {
	interface Window {
		editorAction: EditorAction
	}
}
