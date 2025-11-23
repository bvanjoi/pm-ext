import type { Page } from 'playwright-core'

export interface HTMLSelectorORM {
	value(): string
	appendElement(element: keyof HTMLElementTagNameMap): HTMLSelectorORM
	appendId(id: string): HTMLSelectorORM
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
		appendId(id: string): HTMLSelectorORM {
			selector += `#${id}`
			return this
		},
		appendElement(element: keyof HTMLElementTagNameMap): HTMLSelectorORM {
			selector += element
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
