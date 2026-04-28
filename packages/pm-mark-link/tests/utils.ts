import { docFromHtml, getWindow, pmState } from '@pm-ext/basic-setup'
import { LINK_PLUGIN_SPEC, LINK_SPEC } from '@pm-ext/mark-link'
import { assertValue } from '@pm-ext/utils'
import { type EditorState, Plugin } from 'prosemirror-state'

interface Options {
	initHtml?: string
	pos?: number
	window?: { document: globalThis.Document }
}

export async function linkStateInNode(params: Omit<Options, 'window'> = {}) {
	return import('jsdom').then(d => {
		const jsDOM = new d.JSDOM()
		return linkState({
			...params,
			window: jsDOM.window
		})
	})
}

export function linkState(options: Options = {}): EditorState {
	const initHtml = options.initHtml
	return pmState({
		marks: {
			link: LINK_SPEC
		},
		plugins: [new Plugin(LINK_PLUGIN_SPEC)],
		doc: initHtml
			? schema => {
					const window = getWindow(options.window)
					const ret = docFromHtml(schema, initHtml, {
						window
					})
					assertValue(ret)
					return ret
				}
			: undefined,
		selection: options.pos
	})
}
