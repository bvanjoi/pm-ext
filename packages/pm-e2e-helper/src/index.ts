import type { Node } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

interface EditorAction {
	focusEditor(): void
	nodeAt(pos: number): Node | null
}

declare global {
	interface Window {
		editorAction: EditorAction
	}
}

export function setupEditorAction(view: EditorView) {
	window.editorAction = {
		focusEditor() {
			view.focus()
		},
		nodeAt(pos: number): Node | null {
			return view.state.doc.nodeAt(pos)
		}
	}
}
