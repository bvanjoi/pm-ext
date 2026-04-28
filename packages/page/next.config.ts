import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	typescript: {
		ignoreBuildErrors: true
	},
	images: {
		unoptimized: true
	}
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
