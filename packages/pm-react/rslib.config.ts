import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			dts: true,
			source: {
				tsconfigPath: './tsconfig.build.json',
			},
			output: {
				sourceMap: true,
			},
		},
	],
})
