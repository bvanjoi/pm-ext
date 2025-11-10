'use client'

import { Search } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { cn } from '@/utils'
import { initI18n } from '../i18n/init'
import { LanguageSwitcher } from './language-switcher'

// TODO: move this into preload
initI18n()

export function Sidebar() {
	const { t, i18n } = useTranslation()
	const locale = i18n.language
	const pathname = usePathname()
	const [searchQuery, setSearchQuery] = useState('')

	const allItems = [
		{ name: t('navigationLinks'), href: `/${locale}/docs/basics/links` },
	]

	const filteredItems = allItems.filter(item =>
		item.name.toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<aside className="hidden md:flex w-64 border-r border-border bg-card flex-col overflow-y-auto">
			<div className="sticky top-0 z-50 bg-card border-b border-border px-6 py-6">
				<div className="flex items-center justify-between mb-4">
					<Link href={`/${locale}`} className="font-bold text-lg">
						Prosemirror
					</Link>
					<LanguageSwitcher />
				</div>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						type="text"
						placeholder={t('common.search')}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className="pl-9 h-8 text-sm"
					/>
				</div>
			</div>
			<nav className="flex-1 px-6 py-6">
				<ul className="space-y-2">
					{filteredItems.map(item => (
						<li key={item.href}>
							<Link
								href={item.href}
								className={cn(
									'text-sm px-3 py-2 rounded-md transition-colors block',
									pathname === item.href
										? 'bg-primary text-primary-foreground font-medium'
										: 'text-foreground hover:bg-muted',
								)}
							>
								{item.name}
							</Link>
						</li>
					))}
				</ul>
				{filteredItems.length === 0 && (
					<p className="text-sm text-muted-foreground text-center py-8">
						{t('common.noResults')}
					</p>
				)}
			</nav>
		</aside>
	)
}
