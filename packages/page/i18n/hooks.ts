import * as i18next from 'next-intl'
import type { I18nMessage } from './type'

export type Translate = (key: keyof I18nMessage) => string

export function useTranslation(): { t: Translate } {
	const t = i18next.useTranslations()
	return {
		t: key => t(key)
	}
}

export const mockTranslate: Translate = key => key
