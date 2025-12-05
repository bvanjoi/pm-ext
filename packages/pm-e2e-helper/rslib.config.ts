import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			dts: true,
			format: 'esm',
			bundle: true,
			output: {
				sourceMap: true,
			},
			autoExternal: false,
			source: {
				tsconfigPath: './tsconfig.json',
			},
		},
	],
})
