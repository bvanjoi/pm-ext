import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			dts: true,
			source: {
				tsconfigPath: './tsconfig.json'
			},
			output: {
				sourceMap: true
			},
			bundle: false
		}
	],
	performance: {
		buildCache: false
	}
})
