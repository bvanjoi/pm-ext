import path from 'node:path'
import type { StorybookConfig } from 'storybook-react-rsbuild'

const __dirname = import.meta.dirname

const config: StorybookConfig = {
	framework: 'storybook-react-rsbuild',
	stories: [path.resolve(__dirname, '../src/stories/*.stories.tsx')],
}

export default config
