import { LINK_PLUGIN_SPEC, LINK_SPEC } from '@pm-ext/link'
import { Plugin } from 'prosemirror-state'
import ReactDOMServer from 'react-dom/server'
import { ProsemirrorEditor } from '../../components/pm'

function TestWithLink() {
	const initHtml =
		'<p>Here is a link to <a href="https://www.google.com/">Google</a>.</p>'
	return (
		<ProsemirrorEditor
			marks={{ link: LINK_SPEC }}
			plugins={[new Plugin(LINK_PLUGIN_SPEC)]}
			initHtml={initHtml}
		/>
	)
}

const output = ReactDOMServer.renderToString(<TestWithLink />)
export default output
