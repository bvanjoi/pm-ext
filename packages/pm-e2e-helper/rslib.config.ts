import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			dts: true,
			format: 'esm',
			bundle: true,
			output: {
				sourceMap: true
			},
			source: {
				tsconfigPath: './tsconfig.json'
			}
		}
	],
	performance: {
		buildCache: false
	}
})
