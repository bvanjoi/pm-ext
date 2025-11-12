import type { Page } from 'playwright-core'

export interface HTMLSelectorORM {
	value(): string
	appendAttribute(k: string, v: string): HTMLSelectorORM
}

export function HTMLSelectorORM(): HTMLSelectorORM {
	let selector = ''
	return {
		value(): string {
			return selector
		},
		appendAttribute(k: string, v: string): HTMLSelectorORM {
			selector += `[${k}="${v}"]`
			return this
		},
	}
}

export function PageQuery(page: Page) {
	return {
		isVisible(selector: HTMLSelectorORM): Promise<boolean> {
			return page.isVisible(selector.value())
		},
	}
}
