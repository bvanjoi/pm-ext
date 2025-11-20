import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { expect, test } from '@playwright/experimental-ct-react'
import esbuild from 'esbuild'

async function buildAndRenderToHtml(
	inputPath: string,
): Promise<string | undefined> {
	const outfile = path.resolve(
		__dirname,
		'./tempSSRFixtureOutput',
		`${randomUUID()}.js`,
	)
	await esbuild.build({
		entryPoints: [inputPath],
		outfile,
		bundle: true,
		format: 'esm',
		platform: 'node',
		logLevel: 'error',
		external: ['jsdom'],
	})
	const ret = require(outfile).default
	return ret
}

test('Editor with plain text should has correct HTML output', async () => {
	const inputPath = path.resolve(__dirname, './fixture.tsx')
	const html = await buildAndRenderToHtml(inputPath)
	expect(html).toContain('<div><p>Hello World</p></div>')
})
