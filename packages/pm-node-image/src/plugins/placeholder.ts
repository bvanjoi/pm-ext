import { PluginKey, type PluginSpec, type Transaction } from 'prosemirror-state'
import { Decoration, DecorationSet } from 'prosemirror-view'
import { ImageLoading } from '../components/inline-loading'

export const IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY =
	new PluginKey<DecorationSet>('IMAGE_NODE_PLACEHOLDER_PLUGIN_KEY')

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
				const widget = ImageLoading()
				const deco = Decoration.widget(meta.pos, widget, { id: meta.id })
				return set.add(tr.doc, [deco])
			}
			if (meta.type === 'loaded') {
				const deco = set.find(undefined, undefined, spec => {
					return spec.id === meta.id
				})
				return set.remove(deco)
			}

			return set
		}
	},
	props: {
		decorations(state) {
			return this.getState(state)
		}
	}
}

export function setAddMetaForImageNodePlaceholder(
	tr: Transaction,
	id: string,
	pos?: number
): Transaction {
	const meta: AddMetaForImageNodePlaceholder = {
		type: 'add',
		pos,
		id
	}
	return tr.setMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY, meta)
}

type MetaForImageNodePlaceholderBase = {
	id: string
}

type AddMetaForImageNodePlaceholder = MetaForImageNodePlaceholderBase & {
	type: 'add'
	pos?: number
}

type LoadedMetaForImageNodePlaceholder = MetaForImageNodePlaceholderBase & {
	type: 'loaded'
}

type ImageNodePlaceholderMeta =
	| AddMetaForImageNodePlaceholder
	| LoadedMetaForImageNodePlaceholder

export function getMetaForImageNodePlaceholder(
	tr: Transaction
): ImageNodePlaceholderMeta | undefined {
	return tr.getMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY)
}

export function setRemoveMetaForImageNodePlaceholder(
	tr: Transaction,
	id: string
): Transaction {
	const meta: LoadedMetaForImageNodePlaceholder = {
		type: 'loaded',
		id
	}
	return tr.setMeta(IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY, meta)
}
