import { docFromHtml, pmView } from '@pm-ext/basic-setup'
import type { MarkSpec, NodeSpec, Schema } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'

import * as React from 'react'

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
			const doc = initHtml
				? (schema: Schema) => docFromHtml(schema, initHtml)
				: undefined
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

	return <div ref={domRef} id={id} />
}
