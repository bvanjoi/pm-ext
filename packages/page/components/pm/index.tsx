import { docFromHtml, pmView } from '@pm-ext/basic-setup'
import type {
	MarkSpec,
	NodeSpec,
	Node as PMNode,
	Schema,
} from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'

import * as React from 'react'

import './style.css'
import 'prosemirror-view/style/prosemirror.css'

interface ProsemirrorEditorProps {
	nodes?: {
		[key: string]: NodeSpec
	}
	marks?: {
		[key: string]: MarkSpec
	}
	plugins?: Plugin[]
	initHtml?: string
}

export function ProsemirrorEditor(props: ProsemirrorEditorProps) {
	const domRef = React.useRef<HTMLDivElement>(null)
	const id = React.useId()

	React.useEffect(() => {
		if (domRef.current) {
			const initHtml = props.initHtml
			let doc: ((schema: Schema) => PMNode) | undefined
			if (initHtml) {
				doc = (schema: Schema) => docFromHtml(schema, initHtml)
			}
			const view = pmView({
				nodes: props.nodes,
				marks: props.marks,
				plugins: props.plugins,
				doc,
				selection: Number.POSITIVE_INFINITY,
				container: domRef.current,
			})
			view.focus()
			return () => {
				if (view) {
					view.destroy()
				}
			}
		}
	}, [props])

	return <div ref={domRef} id={id} className="max-w-none p-6 min-h-64" />
}
