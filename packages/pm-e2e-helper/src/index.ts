import { type pmState, pmView } from '@pm-ext/basic-setup'
import type { EditorView } from 'prosemirror-view'

type Props = Parameters<typeof pmState>[0]

function setupEditor(props: Props): EditorView {
	const tempDom = document.createElement('div')
	tempDom.id = 'pm-editor'
	document.body.appendChild(tempDom)

	return pmView({
		...props,
		container: tempDom,
	})
}

export declare var window: Window & {
	setupEditor: (props: Props) => EditorView
}

export function mount() {
	window.setupEditor = setupEditor
}

mount()
