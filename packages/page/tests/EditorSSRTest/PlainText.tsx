import ReactDomServer from 'react-dom/server'
import { ProsemirrorEditor } from '../../components/pm'

function PmEditorWithPlainText() {
	const initHtml = '<p>Hello World</p>'
	return <ProsemirrorEditor initHtml={initHtml} />
}

const output = ReactDomServer.renderToString(<PmEditorWithPlainText />)
export default output
