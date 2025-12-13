import type { Transaction } from 'prosemirror-state'
import type { ImageNodeType } from './types'

export function insertImageNodeAt(
	tr: Transaction,
	imageNodeType: ImageNodeType,
	pos: number,
	src: string,
) {
	const imageNode = imageNodeType.create({
		src,
	})
	return tr.insert(pos, imageNode)
}

export {
	getInlineImageNodeType,
	INLINE_IMAGE_SPEC,
	isInlineImageNodeType,
} from './inline'

export {
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC,
	IMAGE_NODE_PLACEHOLDER_PLUGIN_SPEC_KEY,
} from './plugins/placeholder'

export { ImageNodeViewConstructor } from './view'
