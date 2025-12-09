import type { AttributeSpec, NodeSpec, NodeType } from 'prosemirror-model'

export type ImageNodeSpecAttrs = {
	src: AttributeSpec
	alt: AttributeSpec
	title: AttributeSpec
}

export type ImageNodeSpec = NodeSpec & {
	key: symbol
	attrs: ImageNodeSpecAttrs
}

export type ImageNodeType = NodeType & {
	spec: ImageNodeSpec
}

export type ImageAttrs = {
	src: string
	alt: string
	title: string
}
