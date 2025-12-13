import { build } from 'esbuild'

export async function bundle(inputPath: string): Promise<string> {
	return build({
		entryPoints: [inputPath],
		bundle: true,
		write: false,
		minify: false,
		platform: 'browser',
		external: ['jsdom']
	}).then(result => {
		if (result.outputFiles.length === 1) {
			return result.outputFiles[0].text
		}
		throw new Error('Bundling failed')
	})
}
