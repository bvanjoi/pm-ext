import { expect, test } from '@playwright/test'
import { getInlineImageNodeType, insertImageNodeAt } from '@pm-ext/node-image'
import { assertValue } from '@pm-ext/utils'
import { imageStateInNode } from './utils'

const MOCK_LINK_SRC = 'http://example.com/image.png'
const MOCK_IMAGE_HTML = `<img src="${MOCK_LINK_SRC}" />`

test('inline image should work', async () => {
	const s = await imageStateInNode({
		initHtml: MOCK_IMAGE_HTML
	})
	expect(s.doc.toString()).toBe('doc(p(inlineImage))')
	const imageNode = s.doc.firstChild?.firstChild
	assertValue(imageNode)
	expect(imageNode.attrs.src).toBe(MOCK_LINK_SRC)
	expect(imageNode.attrs.title).toBe('')
	expect(imageNode.attrs.alt).toBe('')
	expect(imageNode.attrs.width).toBeUndefined()
	expect(imageNode.attrs.height).toBeUndefined()
	expect(imageNode.isAtom).toBe(true)
})

test('insert inline image node should work', async () => {
	const s = await imageStateInNode()
	const imageNodeType = getInlineImageNodeType(s.schema, 'inlineImage')
	assertValue(imageNodeType)
	const s0 = s.apply(insertImageNodeAt(s.tr, imageNodeType, 1, MOCK_LINK_SRC))
	expect(s0.doc.toString()).toBe('doc(p(inlineImage))')
})
