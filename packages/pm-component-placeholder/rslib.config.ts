import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			bundle: false,
			dts: true,
			source: {
				tsconfigPath: './tsconfig.json'
			},
			output: {
				sourceMap: true,
				emitCss: true
			}
		}
	],
	performance: {
		buildCache: false
	}
})
