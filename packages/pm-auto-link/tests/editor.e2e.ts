import { expect, test } from '@playwright/test'
import { html } from './utils'

test('auto link should work in website', async ({ page }) => {
	const initHtml = '<p>a.co</p>'
	const h = await html({ initHtml })
	await page.setContent(h)
	expect(await page.content()).toContain('pm-editor')
})
