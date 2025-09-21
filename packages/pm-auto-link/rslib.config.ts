import { defineConfig } from '@rslib/core'

export default defineConfig({
	lib: [
		{
			syntax: 'es2021',
			dts: true,
			source: {
				tsconfigPath: './tsconfig.json',
			},
			output: {
				sourceMap: true,
			},
		},
	],
})
