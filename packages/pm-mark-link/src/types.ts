import type { AttributeSpec, Mark, MarkSpec, MarkType } from 'prosemirror-model'

export type LinkMarkSpecAttrs = {
	originalHref: AttributeSpec
	href: AttributeSpec
	auto: AttributeSpec
}

export type LinkMarkSpec = MarkSpec & {
	key: symbol
	attrs: LinkMarkSpecAttrs
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
