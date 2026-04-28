import en from '../messages/en.json'
import zh from '../messages/zh.json'
import type { I18nMessage } from './type'

export const locales = ['en', 'zh'] as const
export type Locale = (typeof locales)[number]

export const resources: Record<Locale, { translation: I18nMessage }> = {
	en: { translation: en },
	zh: { translation: zh },
}

export const defaultLocale: Locale = 'en'
