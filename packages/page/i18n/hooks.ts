import * as i18next from 'react-i18next'
import type { I18nMessage } from './type'

type T = (key: keyof I18nMessage) => string

export function useTranslation(): { t: T } {
	const { t } = i18next.useTranslation()
	return {
		t: key => t(key),
	}
}
