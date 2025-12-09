import { getNodeTypeBySpecKey } from '@pm-ext/pm-utils'
import { assertValue } from '@pm-ext/utils'
import type { NodeType, Schema } from 'prosemirror-model'
import type { ImageNodeType } from '../types'
import { imageSpec } from '../utils'

export const INLINE_IMAGE_SPEC_SYMBOL: symbol = Symbol(
	'@pm-ext/node/inlineImageSpec',
)

export const INLINE_IMAGE_SPEC = imageSpec({
	key: INLINE_IMAGE_SPEC_SYMBOL,
	inline: true,
	group: 'inline',
})

export function isInlineImageNodeType(
	nodeType: NodeType,
): nodeType is ImageNodeType {
	return nodeType.spec.key === INLINE_IMAGE_SPEC_SYMBOL
}

export function getInlineImageNodeType(
	schema: Schema,
	name: string,
): ImageNodeType | undefined {
	const ty = getNodeTypeBySpecKey(schema.nodes, name, INLINE_IMAGE_SPEC_SYMBOL)
	if (ty) {
		assertValue(isInlineImageNodeType(ty))
		return ty
	}
}
