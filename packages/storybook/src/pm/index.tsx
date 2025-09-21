import { pmView } from '@pm-ext/basic-setup'
import type { MarkSpec, NodeSpec, Node as PMNode } from 'prosemirror-model'
import type { Plugin } from 'prosemirror-state'
import type { EditorView } from 'prosemirror-view'

import * as React from 'react'

import 'prosemirror-view/style/prosemirror.css'

interface ProsemirrorEditorProps {
	doc?: PMNode
	nodes?: {
		[key: string]: NodeSpec
	}
	marks?: {
		[key: string]: MarkSpec
	}
	plugins?: Plugin[]
}

export function ProsemirrorEditor(props: ProsemirrorEditorProps) {
	const domRef = React.useRef<HTMLDivElement>(null)
	const viewRef = React.useRef<EditorView | null>(null)
	const id = React.useId()

	React.useEffect(() => {
		if (domRef.current) {
			viewRef.current = pmView({
				...props,
				container: domRef.current,
			})
		}
	}, [props])

	return <div ref={domRef} id={`pm-ext-${id}`} />
}
