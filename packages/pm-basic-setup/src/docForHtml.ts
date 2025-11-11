import { DOMParser, type Node as PMNode, type Schema } from 'prosemirror-model'

export function docFromHtml(
	schema: Schema,
	html: string,
	options?: { window: { document: globalThis.Document } },
): PMNode | undefined {
	let w: { document: globalThis.Document } | undefined
	if (options) {
		w = options.window
	} else if (typeof window !== 'undefined') {
		w = window
	} else {
		return
	}
	const document = w.document
	const div = document.createElement('div')
	div.innerHTML = html
	return DOMParser.fromSchema(schema).parse(div)
}
