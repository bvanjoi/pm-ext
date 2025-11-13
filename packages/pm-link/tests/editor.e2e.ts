/// <reference types="@pm-ext/e2e-helper" />

import { expect, test } from '@playwright/test'
import { pageHtml } from './utils'

test('auto link should work in website', async ({ page }) => {
	const initHtml = '<p>a.co</p>'
	const h = await pageHtml({ initHtml })
	await page.setContent(h)
	expect(await page.content()).toContain('pm-editor')
	expect(await page.evaluate(() => typeof window.editorAction)).toBe('object')
})
