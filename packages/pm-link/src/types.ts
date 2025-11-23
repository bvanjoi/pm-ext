import type { AttributeSpec, Mark, MarkSpec, MarkType } from 'prosemirror-model'

export type LinkSpecAttrs = {
	originalHref: AttributeSpec
	href: AttributeSpec
	auto: AttributeSpec
}

export type LinkMarkSpec = MarkSpec & {
	key: symbol
	attrs: LinkSpecAttrs
}

export type LinkMarkType = MarkType & {
	spec: LinkMarkSpec
}

export type LinkAttrs = {
	originalHref: string
	href: string
	auto: boolean
}

export type LinkMark = Mark & {
	attrs: LinkAttrs
}
