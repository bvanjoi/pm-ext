import { docFromHtml, pmState, pmViewFromState } from '@pm-ext/basic-setup'
import type {
	MarkSpec,
	NodeSpec,
	Node as PMNode,
	Schema,
} from 'prosemirror-model'
import type { EditorState, Plugin } from 'prosemirror-state'

import * as React from 'react'

import './style.css'
import 'prosemirror-view/style/prosemirror.css'
import type { EditorView } from 'prosemirror-view'

interface ProsemirrorEditorProps {
	nodes?: {
		[key: string]: NodeSpec
	}
	marks?: {
		[key: string]: MarkSpec
	}
	plugins?: Plugin[]
	initHtml?: string

	initView?: (view: EditorView) => void
	destroyView?: () => void
}

function createState(props: ProsemirrorEditorProps): EditorState {
	const { nodes, marks, plugins, initHtml } = props
	let doc: ((schema: Schema) => PMNode) | undefined
	if (initHtml) {
		doc = (schema: Schema) => docFromHtml(schema, initHtml)
	}
	return pmState({
		nodes,
		marks,
		plugins,
		doc,
		selection: Number.POSITIVE_INFINITY,
	})
}

export function ProsemirrorEditor(props: ProsemirrorEditorProps) {
	const domRef = React.useRef<HTMLDivElement>(null)
	const id = React.useId()

	const state = React.useMemo(() => createState(props), [props])

	React.useEffect(() => {
		if (!domRef.current) {
			return
		}
		const view = pmViewFromState(state, domRef.current)
		view.focus()

		if (props.initView) {
			props.initView(view)
		}

		return () => {
			view.destroy()
			if (props.destroyView) {
				props.destroyView()
			}
		}
	}, [])

	return <div ref={domRef} id={id} className="max-w-none p-6 min-h-64" />
}
