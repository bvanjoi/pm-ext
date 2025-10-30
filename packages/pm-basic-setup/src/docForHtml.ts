import { DOMParser, type Node as PMNode, type Schema } from 'prosemirror-model'

export function docFromHtml(
	schema: Schema,
	html: string,
	options?: { window: { document: globalThis.Document } },
): PMNode {
	const document = options ? options.window.document : window.document
	const div = document.createElement('div')
	div.innerHTML = html
	return DOMParser.fromSchema(schema).parse(div)
}
