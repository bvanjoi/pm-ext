/// <reference types="@pm-ext/e2e-helper" />

import path from 'node:path'
import { expect, test } from '@playwright/test'
import { bundle, pageHtml } from '@pm-ext/test-helper'

async function setupHtml(inputPath: string): Promise<string> {
	const content = await bundle(inputPath)
	return pageHtml({ content })
}

test('focus should work', async ({ page }) => {
	const __dirname = import.meta.dirname
	const html = await setupHtml(path.resolve(__dirname, './fixtures/index.ts'))

	await page.setContent(html)

	await Promise.all([
		expect(
			page.evaluate(() => document.querySelector('.ProseMirror'))
		).resolves.toBeTruthy(),
		expect(
			page.evaluate(() => document.querySelector('.ProseMirror-focused'))
		).resolves.toBeFalsy()
	])

	await page.evaluate(() => window.editorAction.focusEditor())

	await Promise.all([
		expect(
			page.evaluate(() => document.querySelector('.ProseMirror'))
		).resolves.toBeTruthy(),
		expect(
			page.evaluate(() => document.querySelector('.ProseMirror-focused'))
		).resolves.toBeTruthy()
	])
})
