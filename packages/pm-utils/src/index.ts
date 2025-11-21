import type { MarkType } from 'prosemirror-model'

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
