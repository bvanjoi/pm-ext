import ReactDOMServer from 'react-dom/server'
import { ProsemirrorEditor } from '../../components/pm'

function PMEditorWithPlainText() {
	const initHtml = '<p>Hello World</p>'
	return <ProsemirrorEditor initHtml={initHtml} />
}

const output = ReactDOMServer.renderToString(<PMEditorWithPlainText />)
export default output
