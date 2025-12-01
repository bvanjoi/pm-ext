import { PluginKey, type PluginSpec, type Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'

export const IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY = new PluginKey(
	'IMAGE_NODE_PLACEHOLDER_PLUGIN_KEY',
)

export const IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC: PluginSpec<DecorationSet> = {
	key: IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY,
	state: {
		init() {
			return DecorationSet.empty
		},
		apply(tr, prevSet) {
			const set = prevSet.map(tr.mapping, tr.doc)
			const meta = getMetaForImageNodePlaceholder(tr)
			if (!meta) {
				return set
			}
			if (meta.type === 'add' && meta.pos) {
				const widget = document.createElement('div')
				widget.className = 'image-node-placeholder'
				widget.innerText = 'Loading image...'
				const deco = Decoration.widget(meta.pos, widget)
				return set.add(tr.doc, [deco])
			}
			if (meta.type === 'remove') {
				return set
			}

			return set
		},
	},
	props: {
		decorations(state) {
			return this.getState(state)
		},
	},
}

export function setAddMetaForImageNodePlaceholder(
	tr: Transaction,
	pos?: number,
): Transaction {
	const meta: AddMetaForImageNodePlaceholder = {
		type: 'add',
		pos,
	}
	return tr.setMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY, meta)
}

type AddMetaForImageNodePlaceholder = {
	type: 'add'
	pos?: number
}

type RemoveMetaForImageNodePlaceholder = {
	type: 'remove'
}

type ImageNodePlaceholderMeta =
	| AddMetaForImageNodePlaceholder
	| RemoveMetaForImageNodePlaceholder

export function getMetaForImageNodePlaceholder(
	tr: Transaction,
): ImageNodePlaceholderMeta | undefined {
	return tr.getMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY)
}

export function setRemoveMetaForImageNodePlaceholder(
	tr: Transaction,
): Transaction {
	const meta: RemoveMetaForImageNodePlaceholder = {
		type: 'remove',
	}
	return tr.setMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY, meta)
}
