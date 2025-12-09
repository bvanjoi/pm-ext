import { docFromHtml, pmState } from '@pm-ext/basic-setup'
import { INLINE_IMAGE_SPEC } from '@pm-ext/node-image'
import { assertValue } from '@pm-ext/utils'
import { JSDOM } from 'jsdom'

interface Props {
	initHtml?: string
	pos?: number
}

export function imageState(props: Props = {}) {
	const initHtml = props.initHtml
	return pmState({
		nodes: {
			inlineImage: INLINE_IMAGE_SPEC,
		},
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
