import fs from 'node:fs/promises'
import { AUTO_LINK_PLUGIN, AUTO_LINK_SPEC } from '@pm-ext/auto-link'
import { pmState } from '@pm-ext/basic-setup'
import { JSDOM } from 'jsdom'
import { DOMParser, type Node as PMNode, type Schema } from 'prosemirror-model'
import { Plugin } from 'prosemirror-state'

function docFromHtml(
	schema: Schema,
	html: string,
	options?: { window: { document: globalThis.Document } },
): PMNode {
	const document = options ? options.window.document : window.document
	const div = document.createElement('div')
	div.innerHTML = html
	return DOMParser.fromSchema(schema).parse(div)
}

interface Props {
	initHtml?: string
	pos?: number
}

export function state(props: Props = {}) {
	const initHtml = props.initHtml
	return pmState({
		marks: {
			link: AUTO_LINK_SPEC,
		},
		plugins: [new Plugin(AUTO_LINK_PLUGIN)],
		doc: initHtml
			? schema => docFromHtml(schema, initHtml, { window: new JSDOM().window })
			: undefined,
		selection: props.pos,
	})
}

export async function html(props: Props): Promise<string> {
	let filePath = import.meta.resolve('@pm-ext/e2e-helper')
	if (filePath.startsWith('file://')) {
		filePath = filePath.slice(7)
	}
	const content = await fs.readFile(filePath, 'utf-8')
	const p = JSON.stringify(props);
	return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title> Editor Test </title>
</head>
<body>
	
	<script>
${content}

const props = JSON.parse('${p}');
window.setupEditor(props);
	</script>

</body>
</html>	
`
}
