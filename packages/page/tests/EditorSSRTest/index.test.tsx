import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { expect, test } from '@playwright/experimental-ct-react'
import esbuild from 'esbuild'

async function buildAndRenderToHtml(
	inputPath: string
): Promise<string | undefined> {
	const outfile = path.resolve(
		__dirname,
		'../../test-results/tempSSRFixtureOutput',
		`${randomUUID()}.js`
	)
	await esbuild.build({
		entryPoints: [inputPath],
		outfile,
		bundle: true,
		format: 'esm',
		platform: 'node',
		logLevel: 'error',
		external: ['jsdom']
	})
	const ret = require(outfile).default
	return ret
}

test('Editor with plain text should has correct HTML output', async () => {
	const inputPath = path.resolve(__dirname, './PlainText.tsx')
	const html = await buildAndRenderToHtml(inputPath)
	expect(html).toContain('<div><p>Hello World</p></div>')
})

test('Editor with text containing a link should has correct HTML output', async () => {
	const inputPath = path.resolve(__dirname, './TextWithLink.tsx')
	const html = await buildAndRenderToHtml(inputPath)
	expect(html).toContain(
		'<div><p>Here is a link to <a href="https://www.google.com/">Google</a>.</p></div>'
	)
})
