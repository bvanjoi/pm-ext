import { expect, test } from '@playwright/experimental-ct-react'
import { TestLinkPopover0 } from './fixture'

test('LinkPopover', async ({ mount }) => {
	const component = await mount(<TestLinkPopover0 />)
	await expect(component).toContainText('editorLink')
})
