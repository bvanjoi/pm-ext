import { baseKeymap } from 'prosemirror-commands'
import { history, redo, undo } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import {
	type MarkSpec,
	type NodeSpec,
	type Node as PMNode,
	Schema,
} from 'prosemirror-model'
import {
	EditorState,
	type Plugin,
	type Selection,
	TextSelection,
} from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'

interface Props {
	nodes?: {
		[key: string]: NodeSpec
	}
	marks?: {
		[key: string]: MarkSpec
	}
	plugins?: Plugin[]
	doc?: PMNode | ((schema: Schema) => PMNode)
	selection?: number | { start: number; end: number }
}

function schema(props: Props) {
	const docSchema: NodeSpec = {
		content: 'block+',
		toDOM: () => ['div', 0],
	}
	const paragraphSchema: NodeSpec = {
		group: 'block',
		content: 'inline*',
		toDOM: () => ['p', 0],
	}
	const textSchema: NodeSpec = {
		group: 'inline',
	}
	return new Schema({
		nodes: {
			doc: docSchema,
			paragraph: paragraphSchema,
			text: textSchema,
			...props.nodes,
		} as const,
		marks: {
			...props.marks,
		} as const,
	})
}

export function pmState(props: Props) {
	const s = schema(props)
	// const tempDom = window.document.createElement('div')
	// tempDom.innerHTML = props.initHtml || ''
	// const doc = DOMParser.fromSchema(s).parse(tempDom)
	const keymapPlugin = keymap({
		...baseKeymap,
		'Mod-z': undo,
		'Shift-Mod-z': redo,
	})

	let doc: PMNode | undefined
	if (typeof props.doc === 'function') {
		doc = props.doc(s)
	} else if (props.doc) {
		doc = props.doc
	}

	let selection: Selection | undefined
	if (doc) {
		if (typeof props.selection === 'number') {
			selection = TextSelection.create(doc, props.selection)
		} else if (props.selection) {
			selection = TextSelection.create(
				doc,
				props.selection.start,
				props.selection.end,
			)
		}
	}

	const state = EditorState.create({
		schema: s,
		doc,
		plugins: [keymapPlugin, history(), ...(props.plugins || [])],
		selection,
	})
	return state
}

export function pmView(
	props: Props & { container: HTMLDivElement },
): EditorView {
	const state = pmState(props)
	const view = new EditorView(props.container, {
		state,
		dispatchTransaction: tr => {
			const next = view.state.apply(tr)
			view.updateState(next)
		},
	})
	return view
}
