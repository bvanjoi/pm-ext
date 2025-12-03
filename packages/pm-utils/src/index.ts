import type { MarkType, NodeType } from 'prosemirror-model'

export function getMarkTypeBySpecKey(
	marks: Record<string, MarkType>,
	name: string,
	specKey: symbol,
): MarkType | undefined {
	const mark = marks[name]
	if (mark && mark.spec.key === specKey) {
		return mark
	}
}

export function getNodeTypeBySpecKey(
	nodes: Record<string, NodeType>,
	name: string,
	specKey: symbol,
): NodeType | undefined {
	const node = nodes[name]
	if (node && node.spec.key === specKey) {
		return node
	}
}
