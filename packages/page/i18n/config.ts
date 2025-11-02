import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
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

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: defaultLocale,
		interpolation: {
			escapeValue: false,
		},
		detection: {
			order: ['localStorage', 'navigator'],
			caches: ['localStorage'],
		},
	})

export default i18n
