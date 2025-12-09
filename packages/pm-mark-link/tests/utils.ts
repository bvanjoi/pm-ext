import { docFromHtml, pmState } from '@pm-ext/basic-setup'
import { LINK_PLUGIN_SPEC, LINK_SPEC } from '@pm-ext/mark-link'
import { assertValue } from '@pm-ext/utils'
import { JSDOM } from 'jsdom'
import { type EditorState, Plugin } from 'prosemirror-state'

interface Options {
	initHtml?: string
	pos?: number
}

export function linkState(options: Options = {}): EditorState {
	const initHtml = options.initHtml
	return pmState({
		marks: {
			link: LINK_SPEC,
		},
		plugins: [new Plugin(LINK_PLUGIN_SPEC)],
		doc: initHtml
			? schema => {
					const ret = docFromHtml(schema, initHtml, {
						window: new JSDOM().window,
					})
					assertValue(ret)
					return ret
				}
			: undefined,
		selection: options.pos,
	})
}
