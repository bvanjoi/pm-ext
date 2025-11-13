import fs from 'node:fs/promises'
import { docFromHtml, pmState } from '@pm-ext/basic-setup'
import { AUTO_LINK_PLUGIN, LINK_SPEC } from '@pm-ext/link'
import { assertValue } from '@pm-ext/utils'
import { JSDOM } from 'jsdom'
import { Plugin } from 'prosemirror-state'

interface Props {
	initHtml?: string
	pos?: number
}

export function state(props: Props = {}) {
	const initHtml = props.initHtml
	return pmState({
		marks: {
			link: LINK_SPEC,
		},
		plugins: [new Plugin(AUTO_LINK_PLUGIN)],
		doc: initHtml
			? schema => {
					const ret = docFromHtml(schema, initHtml, {
						window: new JSDOM().window,
					})
					assertValue(ret)

					return ret
				}
			: undefined,
		selection: props.pos,
	})
}

export async function pageHtml(props: Props): Promise<string> {
	let filePath = import.meta.resolve('@pm-ext/e2e-helper')
	if (filePath.startsWith('file://')) {
		filePath = filePath.slice(7)
	}
	const content = await fs.readFile(filePath, 'utf-8')
	const p = JSON.stringify(props)
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
