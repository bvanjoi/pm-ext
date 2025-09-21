import path from 'node:path'
import type { StorybookConfig } from 'storybook-react-rsbuild'

const config: StorybookConfig = {
	framework: 'storybook-react-rsbuild',
	stories: [path.resolve('src/stories/*.stories.tsx')],
}

export default config
