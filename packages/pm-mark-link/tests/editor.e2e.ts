/// <reference types="@pm-ext/e2e-helper" />

import { expect, test } from '@playwright/test'
import { pageHtml } from '@pm-ext/test-helper'

test('auto link should work in website', async ({ page }) => {
	const h = await pageHtml()
	await page.setContent(h)
	await Promise.all([
		expect(page.content()).resolves.toContain('pm-editor'),
		expect(page.evaluate(() => typeof window.editorAction)).resolves.toBe(
			'object',
		),
		expect(page.evaluate(() => typeof window.editorAction.view)).resolves.toBe(
			'object',
		),
	])
})
