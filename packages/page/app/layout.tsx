import { Analytics } from '@vercel/analytics/next'
import type { Metadata } from 'next'
import { Sidebar } from '@/components/sidebar'

import './globals.css'

export const metadata: Metadata = {
	title: 'v0 App',
	description: 'Created with v0',
	generator: 'v0.app',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={'font-sans antialiased'}>
				<div className="flex min-h-screen bg-background">
					<Sidebar />
					<main className="flex-1 overflow-auto">{children}</main>
				</div>
				<Analytics />
			</body>
		</html>
	)
}
