import { expect, test } from '@playwright/experimental-ct-react'
import { HTMLSelectorORM } from '../utils'
import { ImagePopover0 } from './fixture'

const buttonSelector = HTMLSelectorORM().appendElement('button')

test('empty href for editHref mode of LinkPopover', async ({ mount, page }) => {
	const c = await mount(<ImagePopover0 />)
	await expect(page.locator(buttonSelector.value()).count()).resolves.toBe(1)
	await c.click()
	await expect(page.locator(buttonSelector.value()).count()).resolves.toBe(2)
})
