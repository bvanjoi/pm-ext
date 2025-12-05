import { expect, test } from '@playwright/test'
import { assertValue } from '@pm-ext/utils'
import { imageState } from './utils'

const MOCK_LINK_SRC = 'http://example.com/image.png'
const MOCK_IMAGE_HTML = `<img src="${MOCK_LINK_SRC}" />`

test('image should work', () => {
	const s = imageState({
		initHtml: MOCK_IMAGE_HTML,
	})
	expect(s.doc.toString()).toBe('doc(image)')
	const imageNode = s.doc.firstChild
	assertValue(imageNode)
	expect(imageNode.attrs.src).toBe(MOCK_LINK_SRC)
	expect(imageNode.attrs.title).toBe('')
	expect(imageNode.attrs.alt).toBe('')
	expect(imageNode.isAtom).toBe(true)
})
