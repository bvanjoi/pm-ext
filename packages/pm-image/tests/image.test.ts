import { expect, test } from '@playwright/test'
import { getImageNodeType, insertImageNodeAt } from '@pm-ext/image'
import { assertValue } from '@pm-ext/utils'
import { imageState } from './utils'

test('insert image should work', () => {
	const s = imageState()
	const imageNodeType = getImageNodeType(s.schema, 'image')
	assertValue(imageNodeType)
	const MOCK_LINK_SRC = 'http://example.com/image.png'
	const tr = insertImageNodeAt(s.tr, imageNodeType, 1, MOCK_LINK_SRC)
	const s0 = s.apply(tr)
	expect(s0.doc.toString()).toBe('doc(p, image)')
})
