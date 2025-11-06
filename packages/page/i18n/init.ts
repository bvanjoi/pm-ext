'use client'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { defaultLocale, resources } from './config'

export function initI18n() {
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
}
