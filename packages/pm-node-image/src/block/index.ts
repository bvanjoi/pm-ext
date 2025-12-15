import { getNodeTypeBySpecKey } from '@pm-ext/pm-utils'
import { assertValue } from '@pm-ext/utils'
import type { NodeType, Schema } from 'prosemirror-model'
import type { ImageNodeType } from '../types'
import { imageSpec } from '../utils'

export const BLOCK_IMAGE_SPEC_SYMBOL: symbol = Symbol(
	'@pm-ext/node/blockImageSpec'
)

export const BLOCK_IMAGE_SPEC = imageSpec({
	key: BLOCK_IMAGE_SPEC_SYMBOL,
	inline: false,
	group: 'block'
})

export function isBlockImageNodeType(
	nodeType: NodeType
): nodeType is ImageNodeType {
	return nodeType.spec.key === BLOCK_IMAGE_SPEC_SYMBOL
}

export function getBlockImageNodeType(
	schema: Schema,
	name: string
): ImageNodeType | undefined {
	const ty = getNodeTypeBySpecKey(schema.nodes, name, BLOCK_IMAGE_SPEC_SYMBOL)
	if (ty) {
		assertValue(isBlockImageNodeType(ty))
		return ty
	}
}
