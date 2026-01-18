/// <reference types="@pm-ext/e2e-helper" />

import path from 'node:path'
import { expect, test } from '@playwright/test'
import { bundle } from '@pm-ext/test-helper/bundle'
import { pageHtml } from '@pm-ext/test-helper/pageHtml'

async function setupHtml(inputPath: string): Promise<string> {
	const content = await bundle(inputPath)
	return pageHtml({ content })
}

test('focus should work', async ({ page }) => {
	const __dirname = import.meta.dirname
	const html = await setupHtml(
		path.resolve(__dirname, './fixtures/inline-image.ts')
	)

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

test('the container of image', async ({ page }) => {
	const __dirname = import.meta.dirname
	const casePath = path.resolve(__dirname, './fixtures/inline-image.ts')
	const html = await setupHtml(casePath)

	await page.setContent(html)

	await Promise.all([
		expect(
			page.evaluate(() => {
				const img = document.querySelector(
					'.ProseMirror img'
				) as HTMLImageElement
				return img?.parentElement?.tagName
			})
		).resolves.toBe('SPAN'),
		expect(
			page.evaluate(() => {
				const INLINE_IMAGE_POS = 19
				const node = window.editorAction.nodeAt(INLINE_IMAGE_POS)
				const { width, height } = node?.attrs || {}
				return (
					typeof width === 'number' &&
					typeof height === 'number' &&
					width > 0 &&
					height > 0
				)
			})
		).resolves.toBe(true)
	])
})

test('custom onLoad should work', async ({ page }) => {
	const __dirname = import.meta.dirname
	const casePath = path.resolve(
		__dirname,
		'./fixtures/inline-image-with-custom-onLoad.ts'
	)
	const html = await setupHtml(casePath)
	await page.setContent(html)
	expect(page.title()).resolves.toBe('Image Loaded')
})
