import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import type React from 'react'
import './globals.css'

export const metadata: Metadata = {
	title: 'Prosemirror Editor',
	description: 'A modern rich text editor with customizable features',
	generator: 'v0.app',
	icons: {
		icon: [
			{
				url: '/icon-light-32x32.png',
				media: '(prefers-color-scheme: light)'
			},
			{
				url: '/icon-dark-32x32.png',
				media: '(prefers-color-scheme: dark)'
			},
			{
				url: '/icon.svg',
				type: 'image/svg+xml'
			}
		],
		apple: '/apple-icon.png'
	}
}

type Props = Readonly<{
	children: React.ReactNode
}>

export default function RootLayout({ children }: Props) {
	return (
		<html lang="en">
			<body className={'font-sans antialiased'}>
				<NextIntlClientProvider>{children}</NextIntlClientProvider>
				<Analytics />
			</body>
		</html>
	)
}
