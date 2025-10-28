import path from 'node:path'
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
	framework: '@storybook/nextjs',
	stories: [path.resolve('src/stories/*.stories.tsx')],
}

export default config
