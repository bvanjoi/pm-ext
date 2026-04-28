import type { EditorView } from 'prosemirror-view'
import React from 'react'

const ctx = React.createContext<EditorView | undefined>(undefined)

export function ProseMirrorProvider(props: {
	view: EditorView | undefined
	children: React.ReactNode
}): React.JSX.Element {
	return <ctx.Provider value={props.view}>{props.children}</ctx.Provider>
}

export function useProseMirror(): EditorView | undefined {
	const view = React.useContext(ctx)
	return view
}
