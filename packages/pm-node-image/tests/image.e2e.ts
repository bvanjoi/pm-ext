/// <reference types="@pm-ext/e2e-helper" />

import { expect, test } from '@playwright/test'
import { pageHtml } from '@pm-ext/test-helper'

test('image should work in website', async ({ page }) => {
	const h = await pageHtml()
	await page.setContent(h)
	expect(await page.content()).toContain('pm-editor')
	expect(await page.evaluate(() => typeof window.editorAction)).toBe('object')
	// expect(
	// 	await page.evaluate(() => {
	// 		const image = document.querySelector('img')
	// 		if (image) {
	// 			return image.getAttribute('src')
	// 		}
	// 		throw new Error('Image not found')
	// 	}),
	// ).toBe('http://example.com/image.png')
})
