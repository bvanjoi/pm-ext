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
import { EditorView, type NodeViewConstructor } from 'prosemirror-view'

export interface Config {
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

function schema(config: Config): Schema {
	const docSchema: NodeSpec = {
		content: 'block+',
		toDOM: () => ['div', 0],
	}
	const pSchema: NodeSpec = {
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
			p: pSchema,
			text: textSchema,
			...config.nodes,
		} as const,
		marks: {
			...config.marks,
		} as const,
	})
}

export function pmState(config: Config): EditorState {
	const s = schema(config)
	// const tempDom = window.document.createElement('div')
	// tempDom.innerHTML = props.initHtml || ''
	// const doc = DOMParser.fromSchema(s).parse(tempDom)
	const keymapPlugin = keymap({
		...baseKeymap,
		'Mod-z': undo,
		'Shift-Mod-z': redo,
	})

	let doc: PMNode | undefined
	if (typeof config.doc === 'function') {
		doc = config.doc(s)
	} else if (config.doc) {
		doc = config.doc
	}

	let selection: Selection | undefined
	if (doc) {
		let sel = config.selection
		if (typeof sel === 'number') {
			if (sel > doc.content.size) {
				sel = doc.content.size
			}
			selection = TextSelection.create(doc, sel)
		} else if (sel) {
			selection = TextSelection.create(doc, sel.start, sel.end)
		}
	}

	const state = EditorState.create({
		schema: s,
		doc,
		plugins: [keymapPlugin, history(), ...(config.plugins || [])],
		selection,
	})
	return state
}

export function pmViewFromState(
	state: EditorState,
	container: HTMLDivElement,
	nodeViews?: { [node: string]: NodeViewConstructor },
): EditorView {
	const view = new EditorView(container, {
		state,
		nodeViews,
	})
	return view
}

interface PMViewProps extends Config {
	container: HTMLDivElement
	nodeViews?: { [node: string]: NodeViewConstructor }
}

export function pmView(props: PMViewProps): EditorView {
	return pmViewFromState(pmState(props), props.container, props.nodeViews)
}
