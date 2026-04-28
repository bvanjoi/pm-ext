import { DOMParser, type Node as PMNode, type Schema } from 'prosemirror-model'

export function getWindow(w?: {
	document: globalThis.Document
}): { document: globalThis.Document } | undefined {
	if (w) {
		return w
	}
	if (typeof window !== 'undefined') {
		return window
	}
	return
}

export function docFromHtml(
	schema: Schema,
	html: string,
	options?: { window?: { document: globalThis.Document } }
): PMNode | undefined {
	const w = getWindow(options?.window)
	if (!w) {
		return
	}
	const document = w.document
	const div = document.createElement('div')
	div.innerHTML = html
	return DOMParser.fromSchema(schema).parse(div)
}
