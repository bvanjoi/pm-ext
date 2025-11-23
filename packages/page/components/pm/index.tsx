import { docFromHtml, pmState, pmViewFromState } from '@pm-ext/basic-setup'
import {
	DOMSerializer,
	type MarkSpec,
	type NodeSpec,
	type Node as PMNode,
	type Schema,
} from 'prosemirror-model'
import type { EditorState, Plugin } from 'prosemirror-state'

import * as React from 'react'

import './style.css'
import 'prosemirror-view/style/prosemirror.css'
import { assertValue } from '@pm-ext/utils'
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

	view?: EditorView
	onInitView?: (view: EditorView) => void
	onUpdateView?: (view: EditorView) => void
	onDestroyView?: () => void
}

function createState(props: ProsemirrorEditorProps): EditorState {
	const { nodes, marks, plugins, initHtml } = props
	let doc: ((schema: Schema) => PMNode) | undefined
	if (initHtml) {
		doc = (schema: Schema) => {
			const options = {
				window:
					typeof window !== 'undefined'
						? window
						: new (require('jsdom').JSDOM)().window,
			}
			const ret = docFromHtml(schema, initHtml, options)
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

function ProsemirrorEditorDisplay(props: { state: EditorState }) {
	const options = {
		document: undefined,
	}
	if (typeof window === 'undefined') {
		const jsdom = new (require('jsdom').JSDOM)()
		options.document = jsdom.window.document
	} else {
		return
	}
	const html = DOMSerializer.fromSchema(props.state.schema).serializeNode(
		props.state.doc,
		options,
	)
	if (html.nodeType === html.ELEMENT_NODE) {
		const { innerHTML } = html as Element
		return <div dangerouslySetInnerHTML={{ __html: innerHTML }} />
	}
}

export function ProsemirrorEditor(props: ProsemirrorEditorProps) {
	const { onInitView, onDestroyView, onUpdateView, view } = props

	const [state] = React.useState(() => createState(props))
	const domRef = React.useRef<HTMLDivElement>(null)
	const id = React.useId()

	React.useEffect(() => {
		if (!domRef.current) {
			return
		}
		if (domRef.current.childElementCount !== 0) {
			return
		}

		if (!view) {
			const v = pmViewFromState(state, domRef.current)
			v.update({
				...v.props,
				dispatchTransaction: tr => {
					const next = v.state.apply(tr)
					v.updateState(next)
					if (onUpdateView) {
						onUpdateView(v)
					}
				},
			})
			v.focus()
			if (onInitView) {
				onInitView(v)
			}
		}

		return () => {
			if (view) {
				view.destroy()
				if (onDestroyView) {
					onDestroyView()
				}
			}
		}
	}, [state, view, onInitView, onDestroyView, onUpdateView])

	const style = view ? {} : { display: 'none' }

	return (
		<div className="max-w-none p-6 min-h-64">
			{view ? null : <ProsemirrorEditorDisplay state={state} />}
			<div ref={domRef} id={id} style={style} />
		</div>
	)
}
