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
import { assertValue } from '../../utils'

interface ProsemirrorEditorProps {
	nodes?: {
		[key: string]: NodeSpec
	}
	marks?: {
		[key: string]: MarkSpec
	}
	plugins?: Plugin[]
	initHtml?: string

	mounted: boolean
	view?: EditorView
	initView?: (view: EditorView) => void
	destroyView?: () => void
}

function createState(props: ProsemirrorEditorProps): EditorState {
	const { nodes, marks, plugins, initHtml } = props
	let doc: ((schema: Schema) => PMNode) | undefined
	if (initHtml) {
		doc = (schema: Schema) => {
			const ret = docFromHtml(schema, initHtml)
			assertValue(ret)
			return ret
		}
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

	const { mounted, initView, destroyView, view } = props
	const state = createState(props)

	React.useEffect(() => {
		if (!domRef.current) {
			return
		}

		if (!view && !mounted && initView) {
			const v = pmViewFromState(state, domRef.current)
			v.focus()
			initView(v)
		}

		return () => {
			if (view && mounted && destroyView) {
				view.destroy()
				destroyView()
			}
		}
	}, [mounted, state, view, initView, destroyView])

	return <div ref={domRef} id={id} className="max-w-none p-6 min-h-64" />
}
