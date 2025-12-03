import { getNodeTypeBySpecKey } from '@pm-ext/pm-utils'
import { assertValue } from '@pm-ext/utils'
import type { NodeType, Schema } from 'prosemirror-model'
import type { ImageNodeType } from './types'

export const IMAGE_SPEC_SYMBOL: symbol = Symbol('@pm-ext/imageSpec')

export function isImageNodeType(nodeType: NodeType): nodeType is ImageNodeType {
	return nodeType.spec.key === IMAGE_SPEC_SYMBOL
}

export function getImageNodeType(
	schema: Schema,
	name: string,
): ImageNodeType | undefined {
	const ty = getNodeTypeBySpecKey(schema.nodes, name, IMAGE_SPEC_SYMBOL)
	if (ty) {
		assertValue(isImageNodeType(ty))
		return ty
	}
}
