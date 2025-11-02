'use client'

import { Globe } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { locales } from '@/i18n/config'

const localeLabels = {
	en: 'English',
	zh: '中文',
}

export function LanguageSwitcher() {
	const router = useRouter()
	const pathname = usePathname()
	const { i18n } = useTranslation()
	const locale = i18n.language

	const handleChangeLanguage = (newLocale: string) => {
		// Remove current locale from pathname
		const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

		// Navigate to new locale
		i18n.changeLanguage(newLocale)
		router.push(`/${newLocale}${pathWithoutLocale}`)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="sm" className="gap-2">
					<Globe className="h-4 w-4" />
					<span className="hidden sm:inline">
						{localeLabels[locale as keyof typeof localeLabels]}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{(locales as Array<keyof typeof localeLabels>).map(key => (
					<DropdownMenuItem
						key={key}
						onClick={() => handleChangeLanguage(key)}
						className={locale === key ? 'bg-accent' : ''}
					>
						{localeLabels[key]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
